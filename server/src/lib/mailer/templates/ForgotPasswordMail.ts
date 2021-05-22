import { sendEmail } from '..'

const template = ({ ...args }: { hash: string }) => `
  <a href="http://localhost:3000/reset-password/${args.hash}">Reset your password</a>
`
export const sendForgotPasswrodEmail = (to: string, hash: string) =>
  sendEmail({ to, subject: 'Reset your password', html: template({ hash }) })
