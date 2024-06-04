import jwt from 'jsonwebtoken'
import { envVariables } from '../config/initilize-env-variables-config'
import { NextFunction, Request, Response } from 'express'
import CustomError from './error'

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.token) {
    return next(new CustomError('AuthenticationError'))
  }
  try {
    const user: any = jwt.verify(req.cookies.token, envVariables.JWT_SECRET)

    const { emailId, userId } = user
    if (emailId !== req.body.emailId || userId !== req.body.userId) {
      return next(new CustomError('AuthenticationError', 401))
    }
    req.body.id = userId
    req.body.emailId = emailId
  } catch (err) {
    return next(err)
  }
  next()
}
