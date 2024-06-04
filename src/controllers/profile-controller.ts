import { NextFunction, Request, Response } from 'express'
import { connectDB } from '../config/db-config'
import { EntityManager } from 'typeorm'
import { User } from '../entities/user-entity'
import CustomError from '../middlewares/error'
import {
  commitTransaction,
  startTransaction,
} from '../utils/transaction-handler'

export const updateProfileDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let transactionalEntityManager: EntityManager | null = null

  try {
    const { userId, firstName, lastName } = req.body

    transactionalEntityManager = await startTransaction(connectDB)
    const userRepo = transactionalEntityManager.getRepository(User)
    const userFromDB = await userRepo.findOne({
      where: { id: userId },
    })
    if (!userFromDB) {
      return next(new CustomError('NoUserFoundError', 400))
    }
    if (firstName !== undefined && firstName !== userFromDB?.firstName) {
      userFromDB.firstName = firstName
    }
    if (lastName !== undefined && lastName !== userFromDB?.lastName) {
      userFromDB.lastName = lastName
    }
    if (firstName !== undefined && firstName !== userFromDB?.firstName) {
      userFromDB.firstName = firstName
    }
    await transactionalEntityManager.save(userFromDB)
    await commitTransaction(transactionalEntityManager)

    return res.send({
      success: true,
      user: userFromDB,
    })
  } catch (err) {
    return next(err)
  }
}
