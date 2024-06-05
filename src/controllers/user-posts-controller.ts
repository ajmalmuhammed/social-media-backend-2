import { NextFunction, Request, Response } from 'express'
import { Post } from '../entities/post-entity'
import { connectDB } from '../config/db-config'
import CustomError from '../middlewares/error'
import { EntityManager } from 'typeorm'
import {
  commitTransaction,
  rollbackTransaction,
  startTransaction,
} from '../utils/transaction-handler'
import { PostLike } from '../entities/post-likes-entity'
import { User } from '../entities/user-entity'

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

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let transactionalEntityManager: EntityManager | null = null

  try {
    transactionalEntityManager = await startTransaction(connectDB)
    const postRepository = transactionalEntityManager.getRepository(Post)
    const userRepository = transactionalEntityManager.getRepository(User)
    const authenticatedUser: any = req.body.authenticatedUser
    const userId = authenticatedUser.id
    const postId = parseInt(req.params.postId)

    if (!postId) {
      return next(new CustomError('InvalidInputDataError', 400))
    }
    const post = await postRepository.findOne({
      where: { id: postId },
      relations: ['likedBy'],
    })
    if (!post) {
      return next(new CustomError('EntryNotFoundError', 400))
    }
    const liked = post?.likedBy.filter((user) => user.id === userId)
    if (liked !== undefined && liked?.length > 0) {
      return next(new CustomError('AlreadyLikedError', 400))
    } else {
      const newPostLike = new PostLike(authenticatedUser, post)
      await transactionalEntityManager.getRepository(PostLike).save(newPostLike)
      post.likedBy.push(authenticatedUser)

      post.like_count++
      await postRepository.save(post)
      const user = await userRepository.findOneOrFail({
        where: { id: userId },
        relations: ['likedPosts'],
      })
      user.likedPosts.push(newPostLike)
      await userRepository.save(user)
    }

    const updatedPost = await postRepository.findOneOrFail({
      select: ['like_count'],
      where: { id: postId },
    })
    await commitTransaction(transactionalEntityManager)
    return res
      .status(200)
      .json({ sucess: true, likeCount: updatedPost.like_count })
  } catch (err) {
    if (transactionalEntityManager) {
      await rollbackTransaction(transactionalEntityManager)
    }
    return next(err)
  }
}
