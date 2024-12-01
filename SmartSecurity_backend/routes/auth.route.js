import express from 'express'
import { userLoginController, userLogoutController, userSignupController } from '../controllers/auth.controller.js'

const router=express.Router()

//signup user
router.get('/user/signup',userSignupController)
//login user
router.get('/user/login',userLoginController)
//logout user
router.get('/user/logout',userLogoutController)

export default router;