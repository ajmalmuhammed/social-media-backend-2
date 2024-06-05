import express from 'express'
import { isLoggedIn } from '../middlewares/is-logged-in'
import { createPost } from '../controllers/user-posts-controller'

const router = express.Router()
router.post('/create-post', isLoggedIn, createPost)
export default router
