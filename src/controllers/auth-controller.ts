import otpGenerator from 'otp-generator'
import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import { connectDB } from '../config/db-config'
import { Otp } from '../entities/otp-entity'
import { User } from '../entities/user-entity'
import { encode } from '../middlewares/crypt'
import { sendEmail } from '../services/mail-service'
import { emailTypeEnum } from '../utils/constants'
import CustomError from '../middlewares/error'

//login
export const login = async (
  req: express.Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const emailId = req.body.email

    if (!emailId || emailId == '') {
      next(new CustomError('Email cannot be blank', 400))
    }
    const userRepo = connectDB.getRepository(User)
    const user = await userRepo.findOne({ where: { email: req.body.email } })

    if (user) {
      const { otp, encryptedData } = await generateOTPAndEncode(emailId)
      await sendEmail(emailTypeEnum.VERIFY, emailId, otp)

      return res.send({ success: true, key: encryptedData })
    } else {
      next(new CustomError('Please register first', 400))
    }
  } catch (err: any) {
    console.error(err)
    next(new CustomError())
  }
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const emailId = req.body.email
  const firstName = req.body.firstName
  const lastName = req.body.lastName

  try {
    if (
      !emailId ||
      emailId == '' ||
      !firstName ||
      firstName == '' ||
      !lastName ||
      lastName == ''
    ) {
      next(new CustomError('Required fields cannot be blank', 400))
    }
    const userRepo = connectDB.getRepository(User)

    //check if email already exists in db
    const user = await userRepo.findOne({ where: { email: req.body.email } })

    if (user) {
      next(new CustomError('Email already exists', 400))
    } else {
      const user = await userRepo.save({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      })
    }

    const { otp, encryptedData } = await generateOTPAndEncode(emailId)
    await sendEmail(emailTypeEnum.VERIFY, emailId, otp)

    return res.send({ success: true, key: encryptedData })
  } catch (err: any) {
    next(err)
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token')
  return res.send({ success: true, Details: 'Logout successful' })
}

// To add minutes to the current time
function AddMinutesToDate(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000)
}

export async function generateOTPAndEncode(emailId: string) {
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  })
  const expiresAt = AddMinutesToDate(new Date(), 10)
  const otpRepo = await connectDB.getRepository(Otp)

  //Create OTP instance in DB
  const otp_instance = await otpRepo.save({
    otp: otp,
    expiresAt: expiresAt,
  })

  // Create details object containing the email and otp id
  const details = {
    timestamp: new Date(),
    email: emailId,
    success: true,
    message: 'OTP sent to user',
    otp_id: otp_instance.id,
  }

  // Encrypt the details object
  const encryptedData = await encode(JSON.stringify(details))
  console.log('This is the OTP', otp)
  return { otp, encryptedData }
}
