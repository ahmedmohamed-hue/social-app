import { ApolloProvider } from '@apollo/client'
import { ColorModeScript, ChakraProvider, theme } from '@chakra-ui/react'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import client from './lib/apollo'
import reportWebVitals from './reportWebVitals'
import Routes from './routes'
import * as serviceWorker from './serviceWorker'

import localizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'

dayjs.extend(localizedFormat)

ReactDOM.render(
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme}>
      <ColorModeScript />
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ChakraProvider>
  </ApolloProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
