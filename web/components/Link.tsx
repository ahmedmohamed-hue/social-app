import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

interface LinkProps {
  href: string
  activeClassName?: string
  className?: string
}

const Link: React.FC<LinkProps> = ({ href, children, className, activeClassName }) => {
  const router = useRouter()

  return (
    <NextLink href={href}>
      <a className={`${router.pathname === href ? activeClassName : null} ${className}`}>
        {children}
      </a>
    </NextLink>
  )
}

export default Link
