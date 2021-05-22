import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

const HttpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URI,
  credentials: 'include',
})

// TODO: handle error when the server is down correctly
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link:
    process.env.NODE_ENV === 'production'
      ? HttpLink
      : errorLink.concat(HttpLink),
})

export default client
