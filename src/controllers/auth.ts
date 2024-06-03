import otpGenerator from 'otp-generator'

import express, { NextFunction } from 'express'

import { Request, Response } from 'express'
import { Otp } from '../entities/Otp.entity'
import { User } from '../entities/User.entity'
import { sendEmail } from '../services/mail.service'
import { encode } from '../middlewares/Crypt'
import { connectDB } from '../config/db.config'

//login
export const login = async (
  req: express.Request,
  res: Response,
  next: NextFunction
) => {
  var type = ''
  console.log('Hello', req.body)
  try {
    const email_id = req.body.email

    //if email is empty or null throw error
    if (!email_id || email_id == '') {
      const response = {
        Status: 'Failure',
        Reason: 'Email cannot be blank',
      }
      return res.status(400).send(response)
    }
    const userRepo = connectDB.getRepository(User)
    //check if email already exists in db
    const user = await userRepo.findOne({ where: { email: req.body.email } })

    //if a user was found, that means the user's email matches the entered email
    if (user) {
      //setting the type of operation as LOGIN
      type = 'LOGIN'
    } else {
      const user = await userRepo.save({
        email: req.body.email,
        firstName: 'a',
        lastName: 'b',
      })
      console.log('SAVED USER', user)

      //setting the type of operation as VERIFY(user verification)
      type = 'VERIFY'
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    })
    const now = new Date()
    const expiration_time = AddMinutesToDate(now, 10)
    console.log('This is otp', otp)

    const otpRepo = await connectDB.getRepository(Otp)
    //Create OTP instance in DB
    const otp_instance = await otpRepo.save({
      otp: otp,
      expiresAt: expiration_time,
    })
    // sendEmail(type, email_id, otp)
    // Create details object containing the email and otp id
    const details = {
      timestamp: now,
      email: email_id,
      success: true,
      message: 'OTP sent to user',
      otp_id: otp_instance.id,
    }

    // Encrypt the details object
    const encoded = await encode(JSON.stringify(details))

    return res.send({ Status: 'Success', key: encoded })
  } catch (err: any) {
    next(err)
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token')
  return res.send({ Status: 'Success', Details: 'Logout successful' })
}

// To add minutes to the current time
function AddMinutesToDate(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000)
}
