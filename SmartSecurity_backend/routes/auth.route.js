import express from 'express'
import { checkAuthController, forgotPasswordController, resetPasswordController, userLoginController, userLogoutController, userSignupController, verificationController } from '../controllers/auth.controller.js'
import { isAdmin, isModerator, verifyToken } from '../middleware/verifyToken.js'
import { moderatorLoginController, moderatorResponseController, moderatorSignupController } from '../controllers/auth.moderator.controller.js'
import { verify } from 'crypto'
import { adminLoginController, adminResponseController, adminSignupController } from '../controllers/auth.admin.controller.js'

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



//signup moderator
router.post('/moderator/signup',moderatorSignupController)
//login moderator
router.post('/moderator/login',moderatorLoginController)

//moderator response
router.get('/moderator/get-users',verifyToken,isModerator,moderatorResponseController)

//admin response
router.get('/admin/get-users',verifyToken,isAdmin,adminResponseController)
//admin signup
router.post('/admin/signup',adminSignupController)
//login moderator
router.post('/admin/login',adminLoginController)






export default router;