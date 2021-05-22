export const __prod__ = process.env.NODE_ENV === 'production'

export const SESSION_AGE = 1000 * 60 * 60 * 24 * 365 * 5 // 5 years in ms
