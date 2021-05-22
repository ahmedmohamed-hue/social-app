import { sendEmail } from '..'

const template = ({ ...args }: { hash: string }) => `
  <a href="http://localhost:3000/confirm-email/${args.hash}">Confirm email</a>
`
export const sendConfirmEmail = (to: string, hash: string) =>
  sendEmail({ to, subject: 'Confirm email', html: template({ hash }) })
