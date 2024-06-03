import express from 'express'
import { login, logout } from '../controllers/auth'
import { verifyOTP } from '../controllers/verify-otp'

const router = express.Router()
router.post('/login', login)
// router.get('/logout',logout);
router.post('/verify', verifyOTP)

export default router
