import { createWithApollo } from './withApollo'
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { NextPageContext } from 'next'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const wsLink = process.browser
  ? (ctx: NextPageContext) => {
      return new WebSocketLink({
        uri: 'ws://localhost:4000/subscriptions',
        options: {
          reconnect: true,
        },
      })
    }
  : null

const httpLink = (ctx: NextPageContext) =>
  new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    headers: {
      cookie: (typeof window === 'undefined' ? ctx?.req?.headers.cookie : undefined) || '',
    },
  })
const splitLink = process.browser
  ? (ctx: NextPageContext) =>
      split(
        ({ query }: any) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
          )
        },
        wsLink!(ctx),
        httpLink(ctx)
      )
  : httpLink

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink(ctx),
  })

export const withApollo = createWithApollo(createClient)
