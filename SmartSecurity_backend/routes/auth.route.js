import express from 'express'
import { checkAuthController, forgotPasswordController, resetPasswordController, userLoginController, userLogoutController, userSignupController, verificationController } from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router=express.Router()

//checking authorization
router.get('/check-auth',verifyToken,checkAuthController)

//signup user
router.post('/user/signup',userSignupController)
//login user
router.post('/user/login',userLoginController)
//logout user
router.post('/user/logout',userLogoutController)


//Verification through code
router.post('/verification-email',verificationController)
//forgot password
router.post("/forgot-password", forgotPasswordController);
//reset password
router.post('/reset-password/:token',resetPasswordController)
export default router;