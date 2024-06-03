import { NextFunction, Request, Response } from 'express'

export default class CustomError extends Error {
  statusCode: number

  constructor(message?: string, statusCode?: number) {
    super(message)
    this.statusCode = statusCode || 500
  }
}

export const errorMiddleware = (
  err: CustomError,
  eq: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || 'Internal Server Error'
  err.statusCode = err.statusCode || 500

  return res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    message: err.message,
  })
}
