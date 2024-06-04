import {
  getVerifyEmailMessageBody,
  verifyEmailSubject,
} from '../templates/verification-email-template'
import {
  getLoginEmailMessageBody,
  loginEmailSubject,
} from '../templates/login-email-template'
import { getTransporter } from '../config/mailer-config'
import { envVariables } from '../config/initilize-env-variables-config'
import { emailTypeEnum } from '../utils/constants'

interface MailOptions {
  from: string
  to: string
  subject: string
  text?: string
  html?: string
}

export async function sendEmail(type: string, emailId: string, otp: string) {
  let messageBody = '',
    messageSubject = ''

  //Choosing the message template based on type of request

  console.log('This is a ', type)
  if (type == emailTypeEnum.VERIFY) {
    messageBody = getVerifyEmailMessageBody(otp)
    messageSubject = verifyEmailSubject
  } else if (type == emailTypeEnum.LOGIN) {
    messageBody = getLoginEmailMessageBody(otp)
    messageSubject = loginEmailSubject
  }

  // creating the mail
  const mailOptions: MailOptions = {
    from: `"no-reply-@SocialMedia"<${envVariables.EMAIL_ID}>`,
    to: `${emailId}`,
    subject: messageSubject,
    html: messageBody,
    text: `Dear user, \n\n Your OTP code is: ${otp}\n\nPlease use this code within next 10 minutes.\n\nRegards,\nAdmin`,
  }

  // Sending the mail
  try {
    await getTransporter().sendMail(mailOptions)
    console.log('Email sent succesfully to', emailId)
  } catch (err: any) {
    console.log('Email sending failed to: ', emailId, err)
  }
}
