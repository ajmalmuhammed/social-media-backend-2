import express from 'express'
import { isLoggedIn } from '../middlewares/is-logged-in'
import {
  createPost,
  deletePost,
  getAllPosts,
  likePost,
} from '../controllers/user-posts-controller'

const router = express.Router()
router.post('/post/create', isLoggedIn, createPost)
router.put('/post/like/:postId', isLoggedIn, likePost)
router.delete('/post/delete', isLoggedIn, deletePost)
router.get('/post/get-all', isLoggedIn, getAllPosts)

export default router
