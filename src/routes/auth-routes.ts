import express from 'express'
import { login, logout, register } from '../controllers/auth-controller'
import { verifyOTP } from '../controllers/otp-controller'

const router = express.Router()
router.post('/login', login)
// router.get('/logout',logout);
router.post('/verify', verifyOTP)
router.post('/register', register)
export default router
