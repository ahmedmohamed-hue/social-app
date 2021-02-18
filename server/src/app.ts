import 'reflect-metadata'
import express, { Request, Response } from 'express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/HelloResolver'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import { createConnection } from 'typeorm'
import UserResovler from './resolvers/UserResolver'
import session from 'express-session'
import redis from 'redis'
import connectRedis from 'connect-redis'
import { authChecker } from './utils/authChecker'
import PostResolver from './resolvers/posts'
import http from 'http'
import { Context } from './utils/types'
import User from './entities/User'
import cookie from 'cookie'
import { userLoader } from './utils/userLoader'
import { graphqlUploadExpress } from 'graphql-upload'
import path from 'path'

const main = async () => {
  try {
    await createConnection()
  } catch (e) {
    console.log('Something went wrong whille connecting to the database\n')
    console.error(e)
  }

  const app = express()

  const redisClient = redis.createClient()
  const redisStore = connectRedis(session)

  app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

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
    context: ({ req, res }) => ({ req, res, userLoader: userLoader() }),
    // playground: true,
    subscriptions: {
      path: '/subscriptions',
      // @ts-ignore
      onConnect: async (connectionParams, webSocket, { request }: { request: Request }) => {
        mySession(request, {} as Response, () => {
          const userId = request.session.userId

          User.findOne({ where: { id: userId } }).then(async (user) => {
            if (user) {
              if (!user.isVisible) {
                user.onlineStatus = true
                await user.save()
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
            User.findOne({ where: { id: userId } }).then(async (user) => {
              if (user) {
                if (!user.isVisible) {
                  user.onlineStatus = false
                  user.lastSeen = new Date()
                  await user.save()
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
      origin: 'http://localhost:3000',
    })
  )
  httpServer.listen(4000, () => console.log('http://localhost:4000/graphql'))
}

main()
