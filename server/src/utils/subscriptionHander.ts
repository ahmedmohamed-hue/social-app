import { PrismaClient } from '.prisma/client'
import { Request, Response } from 'express'

export default (session: any, prisma: PrismaClient) => ({
  path: '/subscriptions',
  onConnect: async (_: any, __: any, { request }: { request: Request }) => {
    session(request as Request, {} as Response, async () => {
      const { userId } = request.session

      if (!userId) return

      const user = await prisma.user.findUnique({ where: { id: userId } })

      if (!user) return

      if (!user.isVisible) {
        await prisma.user.update({
          where: { id: user.id },
          data: { onlineStatus: true },
        })
      }
    })
  },
  onDisconnect: (_: any, { request }: { request: Request }) => {
    session(request, {} as Response, async () => {
      const { userId } = request.session

      if (!userId) return

      const user = await prisma.user.findUnique({ where: { id: userId } })

      if (!user) return

      if (!user.isVisible) {
        await prisma.user.update({
          where: { id: user.id },
          data: { onlineStatus: false, lastSeen: new Date() },
        })
      }
    })
  },
})
