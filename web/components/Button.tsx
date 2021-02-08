import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rounded?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, className, rounded, ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-gray-400 text-white font-semibold focus:outline-none hover:bg-gray-500 ${
        rounded ? 'rounded-md' : null
      }  ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
