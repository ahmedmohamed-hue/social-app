import React from 'react'

interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  rounded?: boolean
  error?: string
  icon: any
}

const FieldInput: React.FC<FieldInputProps> = ({
  label,
  rounded,
  className,
  icon,
  error,
  type,
  ...props
}) => {
  const E = <span className="text-sm ml-2 text-red-400 font-semibold">{error}</span>

  return (
    <div className="flex flex-col ">
      <div className="relative">
        {label ? (
          <label className="text-lg block text-gray-600 font-semibold mb-2">{label}</label>
        ) : null}
        {icon ? (
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2 border-r border-gray-400">
            {icon}
          </span>
        ) : null}
        <input
          {...props}
          type={type}
          className={`px-4 py-2 pl-14 w-full border-2 outline-none ${rounded ? 'rounded-xl' : ""
            } ${!!className ? className : ""} ${!!error
              ? 'border-red-500 focus:ring-0 focus:shadow-none mb-0.5'
              : 'border-gray-400 focus:ring focus:ring-gray-300 shadow-md focus:shadow-xl focus:border-0'
            }`}
        />
      </div>

      {!!error ? E : null}
    </div>
  )
}

export default FieldInput
