import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { SessionData } from 'express-session'
import { Redis } from 'ioredis'

declare module 'express-session' {
  export interface SessionData {
    userId: string
  }
}

export interface Context {
  req: Request & { session: SessionData }
  res: Response
  redis: Redis
  prisma: PrismaClient
}
