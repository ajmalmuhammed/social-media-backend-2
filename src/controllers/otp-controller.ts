import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { connectDB } from '../config/db-config'
import { envVariables } from '../config/initilize-env-variables-config'
import { Otp } from '../entities/otp-entity'
import { User } from '../entities/user-entity'
import { decode } from '../middlewares/crypt'
import CustomError from '../middlewares/error'

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      next(
        new CustomError('Use the correct OTP associated with this email', 400)
      )
    }

    const otpRepo = connectDB.getRepository(Otp)
    const userRepo = connectDB.getRepository(User)

    const otpFromDB = await otpRepo.findOne({ where: { id: obj.otp_id } })
    const userFromDB = await userRepo.findOne({
      where: { email: emailFromToken },
    })

    if (!userFromDB) {
      next(new CustomError('Please register first', 400))
      return
    }
    if (!otpFromDB) {
      next(new CustomError('Bad request', 400))
      return
    }

    if (otpFromDB.used) {
      next(new CustomError('OTP already used! Please request new OTP', 400))
      return
    }

    if (compareDates(otpFromDB.expiresAt, currentDate) !== 1) {
      next(new CustomError('OTP Expired! Please request new OTP', 400))
      return
    }

    if (otp !== otpFromDB.otp) {
      next(new CustomError('OTP not matched', 400))
      return
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
      status: 'Login successful',
      email: email,
      firstName: userFromDB.firstName,
      lastName: userFromDB.lastName,
    })
  } catch (err: any) {
    console.error(err)
    next(new CustomError())
  }
}

// returns 1 if first date is greater than second
function compareDates(d1: Date, d2: Date) {
  if (d1 > d2) return 1
  else return 0
}
