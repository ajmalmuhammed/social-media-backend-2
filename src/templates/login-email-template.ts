const loginEmailSubject = 'OTP: Login @SocialMedia'

const getLoginEmailMessageBody = (otp: string) => {
  return `<p>Dear user, </p>
  <p>Your OTP for login is: <strong style="color: blue;">${otp}</strong></p>
  <p> This OTP expires in 10 minutes </p>
  <p style="color: red;"> This is an auto-generated email. Please do not reply to this email.\n\n </p>
  <p style="font-style: italic; color: grey"> Regards\n <br> Admin </p>`
}

export { loginEmailSubject, getLoginEmailMessageBody }
