import { Router } from 'express'

const routes = Router()

routes.get('/', (_, res) => {
  res.json({
    message: 'Apollo graphql API',
    version: process.env.APP_VERSION || '0.0.1',
  })
})

export default routes
