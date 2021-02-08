import { Search } from 'heroicons-react'
import React from 'react'

interface SearchBarProps { }

const SearchBar: React.FC<SearchBarProps> = () => {
  return (
    <div className="relative w-full ml-8">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4">
        <Search size={20} className="text-gray-600" />
      </span>
      <input
        type="text"
        placeholder="Search ..."
        className="px-4 py-2 pl-10 w-56 bg-white border border-gray-400 rounded-xl focus:ring-1 focus:ring-purple-500 focus:outline-none"
      />
    </div>
  )
}

export default SearchBar
