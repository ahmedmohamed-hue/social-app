import { useFormik } from 'formik'
import { motion } from 'framer-motion'
import { LockClosed, User } from 'heroicons-react'
import { useRouter } from 'next/router'
import React from 'react'
import Button from '../components/Button'
import FieldInput from '../components/FieldInput'
import Navbar from '../components/Navbar'
import { CurrentUserDocument, CurrentUserQuery, useLoginMutation } from '../generated/graphql'
import { withApollo } from '../lib/apolloClient'

interface loginProps { }

const login: React.FC<loginProps> = () => {
  const router = useRouter()
  const [login, { error }] = useLoginMutation()

  const { handleSubmit, getFieldProps } = useFormik({
    initialValues: {
      usernameOrEmail: '',
      password: '',
    },
    onSubmit: (values) => {

      login({
        variables: values,
        update: (cache, { data }) => {
          cache.writeQuery<CurrentUserQuery>({
            query: CurrentUserDocument,
            data: {
              __typename: 'Query',
              currentUser: data?.login,
            },
          })
        },
      }).then((res) => {
        router.push("/")
      }).catch(e => {
        console.log(e)
      })
    }
  })

  return (
    <>
      <Navbar />
      <motion.div
        exit={{ x: '-100%' }}
        initial={{ x: '-100%' }}
        animate={{ x: 1, transition: { duration: 0.6 } }}
      >
        <div className="flex justify-center">
          <div className="bg-white border border-gray-300 rounded-lg mt-56 px-10 pb-6">
            <div className="flex items-center justify-center flex-col space-y-4 py-4 md:w-96 sm:w-full">
              <h1 className="text-gray-500 font-test font-semibold text-2xl">Login</h1>
              <hr className="w-11/12 border border-gray-300" />
            </div>
            <form className="mt-5 space-y-8" onSubmit={handleSubmit}>
              <FieldInput
                {...getFieldProps('usernameOrEmail')}
                rounded
                placeholder="Username or email"
                icon={<User className="text-gray-600 text-xl" />}
              />
              <FieldInput
                {...getFieldProps('password')}
                rounded
                placeholder="Password"
                type="password"
                icon={<LockClosed className="text-gray-600 text-xl" />}
                error={error?.message}
              />
              <Button type="submit" className="w-full" rounded>
                Login
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default withApollo({ ssr: true })(login)
