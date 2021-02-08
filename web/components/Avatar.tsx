import React from 'react'

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({ className, src, alt, ...rest }) => {
  return (
    <div
      className={`flex items-center  justify-center w-10 h-10 text-white rounded-full text-lg font-medium leading-5 ${alt ? "bg-red-500" : ""}  focus:outline-none ${className}`}
    >
      {src ? <img src={src} className="w-full h-full rounded-full" alt="Avatar" /> : alt}
    </div>

  )
}

export default Avatar
