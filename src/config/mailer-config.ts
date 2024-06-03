import nodemailer from 'nodemailer'
import { envVariables } from './initilize-env-variables-config'

let transporter: nodemailer.Transporter

export const initMailer = () => {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${envVariables.EMAIL_ID}`,
      pass: `${envVariables.EMAIL_PASSWORD}`,
    },
  })

  transporter.verify((error, success) => {
    if (error) {
      console.error('Error with SMTP configuration:', error)
    } else {
      console.log('SMTP configuration verified:', success)
    }
  })
}

export const getTransporter = () => transporter
