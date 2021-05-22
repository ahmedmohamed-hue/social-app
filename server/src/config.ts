import { CorsOptions } from 'cors'
import { SessionOptions } from 'express-session'
import { SESSION_AGE, __prod__ } from './constants'

export const SESSION_CONFIG: SessionOptions = {
  secret: process.env.SESSION_SECRET!,
  saveUninitialized: false,
  name: process.env.SESSION_NAME,
  cookie: {
    maxAge: SESSION_AGE,
    sameSite: 'lax',
    path: '/',
    secure: __prod__,
    domain: __prod__ ? '.hamoood.codes' : undefined,
    httpOnly: true,
  },
  resave: true,
}

export const CORS_CONFIG: CorsOptions = {
  origin: [process.env.CLIENT_CORS_ORIGIN!, process.env.DASHBOARD_CORS_ORIGIN!],
  credentials: true,
}

export const CONFIRM_EMAIL_PREFIX = 'cf-email-'
export const FORGOT_PASSWORD_PREFIX = 'fg-pwd-'
