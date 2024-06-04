import express from 'express'
import { updateProfileDetails } from '../controllers/profile-controller'
import { isLoggedIn } from '../middlewares/is-logged-in'

const router = express.Router()
router.post('/update-profile', isLoggedIn, updateProfileDetails)
export default router
