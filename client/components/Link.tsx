/* eslint-disable jsx-a11y/anchor-has-content */
import * as React from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link'
import { makeStyles, styled } from '@material-ui/core'
import { isServer } from '../lib/isServer'

type NextComposedProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & NextLinkProps

const NextComposed = React.forwardRef<HTMLAnchorElement, NextComposedProps>((props, ref) => {
  const { as, href, replace, scroll, passHref, shallow, prefetch, ...other } = props

  return (
    <NextLink
      href={href}
      prefetch={prefetch}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
    >
      <a ref={ref} {...other} />
    </NextLink>
  )
})

interface LinkPropsBase {
  activeClassName?: string
  innerRef?: React.Ref<HTMLAnchorElement>
  naked?: boolean
}

export type LinkProps = LinkPropsBase & NextComposedProps & Omit<MuiLinkProps, 'href'>
const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'inherit',
    color: 'inherit',
    '&:focus, &:hover, &:visited, &:link, &:active': {
      textDecoration: 'inherit',
    },
  },
}))
// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
function Link(props: LinkProps) {
  const {
    href,
    activeClassName = 'active',
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props

  const router = useRouter()
  const pathname = typeof href === 'string' ? href : href.pathname
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  })
  const classes = useStyles()

  if (naked) {
    return (
      <NextComposed
        ref={innerRef}
        href={href}
        {...other}
        className={`${classes.link} ${className}`}
      />
    )
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      href={href as string}
      {...other}
    />
  )
}

export default React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link {...props} innerRef={ref} />
))
