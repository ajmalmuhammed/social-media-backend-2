import { NextFunction, Request, Response } from 'express'
import { Post } from '../entities/post-entity'
import { connectDB } from '../config/db-config'

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, authenticatedUser } = req.body
    const newPost = new Post(title, content, authenticatedUser)

    await connectDB.getRepository(Post).save(newPost)

    const response = { success: true, post: newPost }
    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
