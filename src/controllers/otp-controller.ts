import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { connectDB } from '../config/db-config'
import { envVariables } from '../config/initilize-env-variables-config'
import { Otp } from '../entities/otp-entity'
import { User } from '../entities/user-entity'
import { decode } from '../middlewares/crypt'
import CustomError from '../middlewares/error'
import {
  commitTransaction,
  rollbackTransaction,
  startTransaction,
} from '../utils/transaction-handler'
import { EntityManager } from 'typeorm'

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let transactionalEntityManager: EntityManager | null = null
  try {
    const currentDate = new Date()
    const { verification_key, otp, email } = req.body

    if (!verification_key || !otp || !email) {
      return next(new CustomError('InvalidInputDataError', 400))
    }

    let decoded
    try {
      decoded = await decode(verification_key)
    } catch (err) {
      return next(new CustomError())
    }

    const obj = JSON.parse(decoded as string)
    const emailFromToken = obj.email

    if (emailFromToken !== email) {
      return next(new CustomError('AuthenticationError', 400))
    }

    transactionalEntityManager = await startTransaction(connectDB)
    const otpRepo = transactionalEntityManager.getRepository(Otp)
    const userRepo = transactionalEntityManager.getRepository(User)

    const otpFromDB = await otpRepo.findOne({ where: { id: obj.otp_id } })
    const userFromDB = await userRepo.findOne({
      where: { email: emailFromToken },
    })

    if (!userFromDB) {
      return next(new CustomError('NoUserFoundError', 400))
    }
    if (!otpFromDB) {
      return next(new CustomError('AuthenticationError', 400))
    }

    if (otpFromDB.used) {
      return next(new CustomError('OTPExpiredError', 400))
    }

    if (compareDates(otpFromDB.expiresAt, currentDate) !== 1) {
      return next(new CustomError('OTPExpiredError', 400))
    }

    if (otp !== otpFromDB.otp) {
      return next(new CustomError('OTP not matched', 400))
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
    await commitTransaction(transactionalEntityManager)

    return res.status(200).json({
      success: true,
      status: 'Login successful',
      email: email,
      firstName: userFromDB.firstName,
      lastName: userFromDB.lastName,
    })
  } catch (err: any) {
    if (transactionalEntityManager) {
      await rollbackTransaction(transactionalEntityManager)
    }
    console.error(err)
    next(new CustomError())
  }
}

// returns 1 if first date is greater than second
function compareDates(d1: Date, d2: Date) {
  if (d1 > d2) return 1
  else return 0
}
