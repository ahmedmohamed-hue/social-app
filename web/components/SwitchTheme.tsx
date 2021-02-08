import { Switch as SwitchUI } from '@headlessui/react'
import React, { useState } from 'react'
import { isServer } from '../lib/isServer'

interface SwitchProps {
  checked: boolean
  className?: string
  activeClassName?: string
}

const Switch: React.FC<SwitchProps> = ({ className, activeClassName }) => {
  let theme

  if (!isServer) {
    theme = localStorage.getItem('theme') || 'light'
  }

  const [themeValue, setTheme] = useState(theme)

  const [enabled, setEnabled] = useState(theme === 'dark')

  const handleToggle = () => {
    if (themeValue === 'dark') {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
      setEnabled(false)
      setTheme('light')
    } else {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
      setEnabled(true)
      setTheme('dark')
    }
  }

  return (
    <SwitchUI
      as="button"
      checked={enabled}
      onChange={handleToggle}
      className={`${enabled ? `bg-blue-500 ${activeClassName}` : 'bg-gray-200'
        } relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline ${className}`}
    >
      {({ checked }) => (
        <span
          className={`${checked ? 'translate-x-5' : 'translate-x-0'
            } inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full`}
        />
      )}
    </SwitchUI>
  )
}

export default Switch
