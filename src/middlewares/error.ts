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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage = getSafeErrorMessage(err)

  err.message = errorMessage
  err.statusCode = err.statusCode || 500

  return res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    message: err.message,
  })
}

// Helper function to determine safe error message to send to users
const getSafeErrorMessage = (err: CustomError): string => {
  const safeErrorMessages: { [key: string]: string } = {
    NoUserFoundError: 'No user found with the email. Please register first.',
    AccessDeniedError: 'Access denied. Please log in first.',
    InvalidInputDataError: 'Please provide all the mandatory fields',
    OTPExpiredError: 'OTP Expired! Please request new OTP',
    AuthenticationError: 'Authentication failed. Please try again',
    UserExistsError: 'User already registered. Please login',
    EntryNotFoundError: 'Entry not found. Please try with valid ID',
    AlreadyLikedError: 'User has already liked the post',
  }

  const safeMessage = safeErrorMessages[err.message]
  if (!safeMessage) {
    console.error(err)
  }
  return safeMessage || 'Something went wrong. Please try again later.'
}
