import { Menu, Transition } from '@headlessui/react'
import Link from 'components/Link'
import { Cog, Logout, Moon } from 'heroicons-react'
import React from 'react'
import { User } from '../../generated/graphql'
import Avatar from '../Avatar'
import Switch from '../SwitchTheme'

interface DropdownMenuProps {
  handleLogout: () => void
  user?: User
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ handleLogout, user }) => {
  return (
    <div className="relative inline-block text-left select-none">
      <Menu>
        {({ open }: any) => (
          <>
            <span className="flex items-center">
              <Menu.Button className="focus:outline-none focus:border-0">
                <img
                  src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
                  alt={user?.firstName[0].toUpperCase()}
                  className="w-10 h-10 rounded-full"
                />
              </Menu.Button>
            </span>

            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-200 rounded-md shadow-lg outline-none dark:bg-gray-900 dark:border-gray-800"
              >
                <div className="px-4 py-3 flex flex-col items-center justify-center space-y-1">
                  <img
                    src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
                    alt={user?.firstName[0].toUpperCase()}
                    className="w-16 h-16 rounded-full"
                  />
                  <Link
                    href={`/prorfile/${user?.username}`}
                    className="text-gray-500 text-sm dark:text-gray-300"
                  >
                    @{user?.username}
                  </Link>
                </div>

                <div className="py-0">
                  <Menu.Item
                    as="div"
                    className="space-x-4 flex items-center w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 ring-gray-200"
                  >
                    <Cog size={22} />
                    <Link href="/account-settings">Account settings</Link>
                  </Menu.Item>
                  <Menu.Item
                    as="div"
                    disabled
                    className="flex items-center w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 ring-gray-200"
                  >
                    <Moon size={22} />
                    <span className="ml-4">Dark mode</span>
                    <Switch checked={false} className="ml-auto" activeClassName="bg-indigo-600" />
                  </Menu.Item>
                </div>

                <div className="py-1">
                  <Menu.Item
                    as="div"
                    onClick={handleLogout}
                    className="space-x-4 flex cursor-pointer items-center w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 ring-gray-200"
                  >
                    <Logout size={22} />
                    <span>Sign out</span>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}

export default DropdownMenu
