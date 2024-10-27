import express from 'express'
import { register,login,logout, getProfile, editProfile, getSuggestedUser, followOrUnfollow } from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../middlewares/multer.js'

const router=express.Router()


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').get(isAuthenticated,getProfile)
router.route('/profile/edit').put(isAuthenticated,upload.single('profilePicture'),editProfile)
router.route('/suggested').get(isAuthenticated,getSuggestedUser)
router.route('/followOrUnfollow/:id').post(isAuthenticated,followOrUnfollow)

export default router;