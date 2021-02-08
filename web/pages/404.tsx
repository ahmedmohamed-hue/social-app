import React from 'react'
import Link from '../components/Link'

const NotFound: React.FC = () => {
  return (
    <div className="w-full h-screen flex items-center mt-56 flex-col space-y-2">
      <h1 className="text-2xl block font-semibold font-test text-gray-800">404</h1>
      <h1 className="text-sm font-test text-gray-500">
        Could not find the page that you are looking for.
      </h1>
      <h1 className="text-gray-500 text-sm font-test">
        you can go back{' '}
        <Link href="/" className="text-gray-800 text-lg">
          Home
        </Link>
      </h1>
    </div>
  )
}

export default NotFound
