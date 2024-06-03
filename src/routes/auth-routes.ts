import express from 'express'
import { login, logout } from '../controllers/auth-controller'
import { verifyOTP } from '../controllers/verify-otp-controller'

const router = express.Router()
router.post('/login', login)
// router.get('/logout',logout);
router.post('/verify', verifyOTP)

export default router
