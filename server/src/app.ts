import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import connectRedis from 'connect-redis'
import cors from 'cors'
import express, { Request, Response } from 'express'
import session from 'express-session'
import { graphqlUploadExpress } from 'graphql-upload'
import http from 'http'
import path from 'path'
import redis from 'redis'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello.resolver'
import PostResolver from './resolvers/post.resolver'
import UserResovler from './resolvers/user.resolver'
import { authChecker } from './utils/authChecker'
import { PrismaClient } from '@prisma/client'

const main = async () => {
  const app = express()

  const prisma = new PrismaClient()

  const redisClient = redis.createClient()
  const redisStore = connectRedis(session)

  app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }))

  const mySession = session({
    name: 'eid',
    store: new redisStore({ client: redisClient, disableTTL: true }),
    secret: '2131431124',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
      sameSite: 'lax',
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
  })

  app.use(mySession)
  app.use(graphqlUploadExpress())

  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResovler, PostResolver],
    authChecker,
  })

  const apolloServer = new ApolloServer({
    schema,
    uploads: false,
    context: ({ req, res }) => ({
      req,
      res,
      prisma,
    }),
    subscriptions: {
      path: '/subscriptions',
      // @ts-ignore
      onConnect: async (connectionParams, webSocket, { request }: { request: Request }) => {
        mySession(request, {} as Response, () => {
          const userId = request.session.userId

          prisma.user.findUnique({ where: { id: userId } }).then(async (user) => {
            if (user) {
              if (!user.isVisible) {
                await prisma.user.update({ where: { id: user.id }, data: { onlineStatus: true } })
              }
            }
          })
        })
      },
      // @ts-ignore
      onDisconnect: (webSocket, { request }: { request: Request }) => {
        mySession(request, {} as Response, () => {
          const userId = request.session.userId
          if (userId) {
            prisma.user.findUnique({ where: { id: userId } }).then(async (user) => {
              if (user) {
                if (!user.isVisible) {
                  await prisma.user.update({
                    where: { id: user.id },
                    data: { onlineStatus: false, lastSeen: new Date() },
                  })
                }
              }
            })
          }
        })
      },
    },
  })

  const httpServer = http.createServer(app)

  apolloServer.applyMiddleware({ app, cors: false })
  apolloServer.installSubscriptionHandlers(httpServer)

  app.use('/static', express.static(path.join(__dirname, 'public')))

  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
    })
  )
  httpServer.listen(4000, () => console.log('http://localhost:4000/graphql'))
}

main()
