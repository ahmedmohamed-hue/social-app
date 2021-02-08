import Switch from 'components/SwitchTheme'
import { motion } from 'framer-motion'
import Head from 'next/head'
import React from 'react'
import Navbar from '../components/Navbar'
import { useCurrentUserQuery } from '../generated/graphql'
import { withApollo } from '../lib/apolloClient'

const Home = () => {
  const { data } = useCurrentUserQuery()

  return (
    <>
      <Head>
        <title>Nextjs App</title>
      </Head>
      <Navbar />
      <motion.div exit={{ opacity: 1 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-test font-semibold text-gray-600">
          {data?.currentUser
            ? `Welcome ${data.currentUser.firstName} ${data.currentUser.lastName}`
            : 'Docker is here bb'}
        </h1>
      </motion.div>
    </>
  )
}

export default withApollo({ ssr: true })(Home)
