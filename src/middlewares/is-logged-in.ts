import jwt from 'jsonwebtoken'
import { envVariables } from '../config/initilize-env-variables-config'
import { NextFunction, Request, Response } from 'express'
import CustomError from './error'
import { connectDB } from '../config/db-config'
import { User } from '../entities/user-entity'

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.token) {
    return next(new CustomError('AuthenticationError'))
  }
  try {
    const user: any = jwt.verify(req.cookies.token, envVariables.JWT_SECRET)

    const { emailId, userId } = user
    const authenticatedUser = await connectDB.getRepository(User).findOne({
      select: ['id', 'emailId'],
      where: { id: userId, emailId: emailId },
    })
    if (!authenticatedUser) {
      return next(new CustomError('AuthenticationError', 401))
    }
    req.body.authenticatedUser = authenticatedUser
  } catch (err) {
    return next(err)
  }
  next()
}
