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
import { Redis } from 'ioredis'

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, authenticatedUser } = req.body
    const newPost = new Post(title, content, authenticatedUser)

    await connectDB.getRepository(Post).save(newPost)

    return res.json({ success: true, post: newPost })
  } catch (err) {
    next(err)
  }
}

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let transactionalEntityManager: EntityManager | null = null

  try {
    const { postId, authenticatedUser } = req.body

    transactionalEntityManager = await startTransaction(connectDB)
    const postRepository = transactionalEntityManager.getRepository(Post)
    if (!postId) {
      return next(new CustomError('InvalidInputDataError', 400))
    }
    const post = await postRepository.findOne({
      where: { id: postId, deleted: false },
    })
    if (!post) {
      return next(new CustomError('EntryNotFoundError', 400))
    }

    if (post.created_by_id === authenticatedUser.id) {
      post.markAsDeleted()
      await transactionalEntityManager.save(post)
      await commitTransaction(transactionalEntityManager)
      return res.send({ success: true })
    } else {
      next(new CustomError('NoPermissionError'))
    }
  } catch (err) {
    if (transactionalEntityManager) {
      await rollbackTransaction(transactionalEntityManager)
    }
    next(err)
  }
}
export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let transactionalEntityManager: EntityManager | null = null
  try {
    const redis = new Redis()

    const { authenticatedUser } = req.body
    const cachedPosts = await redis.get(`posts?user=${authenticatedUser.id}`)
    if (cachedPosts) {
      const posts = JSON.parse(cachedPosts)
      return res.json({ success: true, posts })
    }

    transactionalEntityManager = await startTransaction(connectDB)
    const posts = await transactionalEntityManager
      .getRepository(Post)
      .find({ where: { created_by_id: authenticatedUser.id, deleted: false } })

    await redis.set(
      `posts?user=${authenticatedUser.id}`,
      JSON.stringify(posts),
      'EX',
      120
    )
    return res.json({ success: true, posts })
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
      where: { id: postId, deleted: false },
      relations: ['likedBy'],
    })
    if (!post) {
      return next(new CustomError('EntryNotFoundError', 400))
    }

    const existingLike = post?.likedBy.filter((user) => user.id === userId)
    if (existingLike !== undefined && existingLike?.length > 0) {
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
