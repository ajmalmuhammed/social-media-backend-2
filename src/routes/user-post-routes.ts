import express from 'express'
import { isLoggedIn } from '../middlewares/is-logged-in'
import { createPost, likePost } from '../controllers/user-posts-controller'

const router = express.Router()
router.post('/create-post', isLoggedIn, createPost)
router.put('/like-post/:postId', isLoggedIn, likePost)
export default router
