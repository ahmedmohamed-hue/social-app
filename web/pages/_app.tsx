import { AnimateSharedLayout } from 'framer-motion'
import Router from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { isServer } from '../lib/isServer'
import '../styles/globals.css'


NProgress.configure({ showSpinner: false })

Router.events.on('routeChangeStart', (url) => {
  NProgress.start()
})

Router.events.on('routeChangeComplete', () => NProgress.done())

Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: any) {
  if (!isServer) {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <AnimateSharedLayout>
      <Component {...pageProps} />
    </AnimateSharedLayout>
  )
}

export default MyApp
