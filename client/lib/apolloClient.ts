import { createWithApollo } from './withApollo'
import { ApolloClient, ApolloLink, InMemoryCache, split } from '@apollo/client'
import { NextPageContext } from 'next'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { createUploadLink } from 'apollo-upload-client'
import { onError } from '@apollo/client/link/error'
import { PaginatedPosts } from '../generated/graphql'

const wsLink = process.browser
  ? new WebSocketLink({
      uri: 'ws://localhost:4000/subscriptions',
      options: {
        reconnect: true,
      },
    })
  : null

const httpLink = (ctx: NextPageContext) =>
  (createUploadLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    headers: {
      cookie: (typeof window === 'undefined' ? ctx?.req?.headers.cookie : undefined) || '',
    },
  }) as unknown) as ApolloLink

const splitLink = process.browser
  ? (ctx: NextPageContext) =>
      split(
        ({ query }: any) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
          )
        },
        wsLink!,
        httpLink(ctx)
      )
  : httpLink

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            paginatedPosts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                }
              },
            },
          },
        },
      },
    }),
    link: ApolloLink.from([errorLink, splitLink(ctx)]),
  })

export const withApollo = createWithApollo(createClient)
