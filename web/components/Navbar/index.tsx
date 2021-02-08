import { useApolloClient } from '@apollo/client'
import Link from 'components/Link'
import { Menu } from 'heroicons-react'
import { useRouter } from 'next/router'
import React from 'react'
import { useCurrentUserQuery, useLogoutMutation } from '../../generated/graphql'
import { isServer } from '../../lib/isServer'
import SearchBar from '../SearchBar'
import DropdownMenu from './DropdownMenu'

interface NavbarProps { }

const index: React.FC<NavbarProps> = () => {
  const router = useRouter()

  const apolloClient = useApolloClient()
  const [logout] = useLogoutMutation()
  const { data, loading } = useCurrentUserQuery({ skip: isServer })

  if (loading) return null

  const handleLogout = async () => {
    await logout()
    await apolloClient.resetStore()

    router.push('/')
  }

  return (
    <nav className="bg-white border-b border-gray-300 py-4 shadow-md select-non dark:bg-gray-900 select-none">
      <div className="px-6 md:px-10">
        <div className="flex items-center">
          <button>
            <Menu />
          </button>

          <div className="flex items-center flex-1 relative">
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8">
                <img src="/vector.svg" alt="logo" className="inline-block w-8 h-8" />
              </div>
              <h1 className="text-xl font-semibold ml-2 font-test text-purple-600">Tailwindcss</h1>{' '}
            </div>
            <div className="ml-8 space-x-4 hidden md:block">
              <Link href="/" className="font-test text-gray-400 font-medium">
                Posts
              </Link>
              <Link href="#" className="font-test font-medium text-gray-400">
                People
              </Link>
              <Link href="#" className="font-test font-medium text-gray-400">
                Posts
              </Link>
            </div>
            <SearchBar />
          </div>

          <div className="flex items-center space-x-4">
            {data?.currentUser ? (
              <DropdownMenu handleLogout={handleLogout} user={data.currentUser} />
            ) : (
                <>
                  <Link
                    href="login"
                    className="text-white bg-purple-600 font-medium px-4 py-2 rounded-xl"
                  >
                    Login
                </Link>
                  <a
                    href="#"
                    className="bg-white text-purple-500 border border-purple-600 font-medium px-4 py-2 rounded-2xl dark:bg-gray-900 dark:text-purple-100"
                  >
                    Signup
                </a>
                </>
              )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default index
