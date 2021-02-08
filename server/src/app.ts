import 'reflect-metadata'
import express from 'express'
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

  app.use(
    session({
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
  )

  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResovler, PostResolver],
    authChecker,
  })

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.use(
    cors({
      origin: 'http://localhost:3000',
    })
  )
  app.listen(4000, () => console.log('http://localhost:4000/graphql'))
}

main()
