import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express'
import connectRedis from 'connect-redis'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import expressSession from 'express-session'
import { graphqlUploadExpress } from 'graphql-upload'
import { createServer } from 'http'
import Redis from 'ioredis'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { CORS_CONFIG, SESSION_CONFIG } from './config'
import { __prod__ } from './constants'
import authChecker from './lib/authChecker'
import './lib/passport'
import CommentResolver from './resolvers/comment'
import PostResolver from './resolvers/post'
import { TestResovler } from './resolvers/test.resolver'
import UserResover from './resolvers/user'
import routes from './routes'
import subscriptionHander from './utils/subscriptionHander'

dotenv.config({
  path: '.env',
})

export const prisma = new PrismaClient()
const app = express()

// Bootstraping
const main = async () => {
  const redis = new Redis(process.env.REDIS_URL || undefined)
  const RedisStore = connectRedis(expressSession)

  // Express middlwares
  const session = expressSession({
    ...SESSION_CONFIG,
    store: new RedisStore({
      client: redis,
      disableTTL: true,
    }),
  })

  app.set('trust proxy', 1)

  app.use(express.json())
  app.use(cors(CORS_CONFIG))

  app.use(graphqlUploadExpress())

  app.use(session)
  app.use(routes)

  const schema = await buildSchema({
    resolvers: [
      TestResovler,
      ...UserResover,
      ...PostResolver,
      ...CommentResolver,
    ],
    authChecker,
    validate: __prod__,
  })

  const apolloServer = new ApolloServer({
    schema,
    playground: !__prod__,
    uploads: false,
    context: ({ req, res }) => ({ req, res, redis, prisma }),
    // @ts-ignore
    subscriptions: {
      ...subscriptionHander(session, prisma),
    },
  })

  const PORT = process.env.PORT || 5000

  const server = createServer(app)

  apolloServer.applyMiddleware({ app, cors: false })
  apolloServer.installSubscriptionHandlers(server)

  server.listen(PORT, () =>
    console.log(
      `🚀 Server has started at http://localhost:${PORT}\n📈 Graphql playground http://localhost:${PORT}/graphql`
    )
  )
}

main()
