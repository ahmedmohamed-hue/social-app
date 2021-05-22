declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    PORT: string
    SESSION_NAME: string
    SESSION_SECRET: string
    CLIENT_CORS_ORIGIN: string
    DASHBOARD_CORS_ORIGIN: string
    S3_ACCESS_KEY: string
    S3_SECRET_KEY: string
    BUCKET_NAME: string
  }
}
