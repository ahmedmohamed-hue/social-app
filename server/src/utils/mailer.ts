import nodemailer from 'nodemailer'

interface options {
  html: string
  to: string
  subject: string
}

export const sendEmail = async ({ ...options }: options) => {
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
    from: `"Hamoood 👻" <info@hamoood.tech`,
    ...options,
  })

  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}
