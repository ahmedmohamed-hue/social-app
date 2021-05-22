import nodemailer, { SendMailOptions } from 'nodemailer'

export const sendEmail = async ({ ...options }: SendMailOptions) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hamoood.tech',
    port: 587,
    secure: false,
    logger: true,
    ignoreTLS: true,
    auth: {
      user: 'info@hamoood.tech',
      pass: 'NcAetU(*e5',
    },
  })

  const info = await transporter.sendMail({
    from: '"Hamoood" <info@hamoood.tech> ',
    ...options,
  })

  console.log(`Email sent: ${info.messageId}`)
}
