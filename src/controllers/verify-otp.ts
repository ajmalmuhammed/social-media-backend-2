import { Request, Response } from 'express'
import { decode } from '../middlewares/Crypt'
import { Otp } from '../entities/Otp.entity'
import { User } from '../entities/User.entity'
import jwt from 'jsonwebtoken'
import { envVariables } from '../config/initilize-env-variables.config'
import { connectDB } from '../config/db.config'

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date()
    const { verification_key, otp, email } = req.body

    if (!verification_key) {
      return res
        .status(400)
        .json({ Status: 'Failure', Reason: 'Verification key cannot be blank' })
    }
    if (!otp) {
      return res
        .status(400)
        .json({ Status: 'Failure', Reason: 'OTP cannot be blank' })
    }
    if (!email) {
      return res
        .status(400)
        .json({ Status: 'Failure', Reason: 'Email cannot be blank' })
    }

    let decoded
    try {
      decoded = await decode(verification_key)
    } catch (err) {
      return res
        .status(400)
        .json({ Status: 'Failure', Reason: 'Bad Request', err })
    }

    const obj = JSON.parse(decoded as string)
    const emailFromToken = obj.email

    if (emailFromToken !== email) {
      return res.status(400).json({
        Status: 'Failure',
        Reason: 'Use the correct OTP associated with this email',
      })
    }

    const otpRepo = connectDB.getRepository(Otp)
    const userRepo = connectDB.getRepository(User)

    const otpFromDB = await otpRepo.findOne({ where: { id: obj.otp_id } })
    const userFromDB = await userRepo.findOne({
      where: { email: emailFromToken },
    })

    if (!userFromDB) {
      return res
        .status(400)
        .json({ Status: 'Failure', Reason: 'Please sign up first' })
    }

    if (!otpFromDB) {
      return res.status(400).json({ Status: 'Failure', Reason: 'Bad Request' })
    }

    if (otpFromDB.used) {
      return res.status(400).json({
        Status: 'Failure',
        Reason: 'OTP already used! Please request new OTP',
      })
    }

    if (compareDates(otpFromDB.expiresAt, currentDate) !== 1) {
      return res.status(400).json({
        Status: 'Failure',
        Reason: 'OTP Expired! Please request new OTP',
      })
    }

    if (otp !== otpFromDB.otp) {
      return res
        .status(400)
        .json({ Status: 'Failure', Reason: 'OTP NOT Matched' })
    }

    otpFromDB.used = true
    await otpRepo.save(otpFromDB)

    const userId = userFromDB.id
    const token = jwt.sign({ email, userId }, envVariables.JWT_SECRET, {
      expiresIn: '25 days',
    })

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 2160000000,
      secure: process.env.ENV === 'prod',
    })

    if (!userFromDB.isVerified) {
      userFromDB.isVerified = true
      await userRepo.save(userFromDB)
      return res
        .status(200)
        .json({ Status: 'Account verification successful', Email: email })
    }

    return res.status(200).json({
      status: 'Account verification successfull',
      email: email,
      firstName: userFromDB.firstName,
      lastName: userFromDB.lastName,
    })
  } catch (err: any) {
    return res.status(400).json({ Status: 'Failure', Reason: err.message })
  }
}

// returns 1 if first date is greater than second
function compareDates(d1: Date, d2: Date) {
  if (d1 > d2) return 1
  else return 0
}
