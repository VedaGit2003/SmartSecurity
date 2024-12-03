import express from 'express'
import { checkAuthController, forgotPasswordController, mydetails, resetPasswordController, updateMydetails, userLoginController, userLogoutController, userSignupController, verificationController } from '../controllers/auth.controller.js'
import { isAdmin, isModerator, verifyToken } from '../middleware/verifyToken.js'
import { moderatorLoginController, moderatorResponseController, moderatorSignupController, updateUser } from '../controllers/auth.moderator.controller.js'
import { verify } from 'crypto'
import { adminLoginController, adminResponseController, adminSignupController, updateUserModerator } from '../controllers/auth.admin.controller.js'

const router=express.Router()



//signup user
router.post('/user/signup',userSignupController)
//login user
router.post('/user/login',userLoginController)
//logout user
router.post('/user/logout',userLogoutController)


//Verification through code
router.post('/verification-email',verificationController)
//checking authorization
router.get('/check-auth',verifyToken,checkAuthController)
//geting own details
router.get('/user/my-details',verifyToken,mydetails)
//update name of user
router.put('/user/update-name',verifyToken,updateMydetails)
//forgot password
router.post("/forgot-password", forgotPasswordController);
//reset password
router.post('/reset-password/:token',resetPasswordController)


// =========Moderator Routes=========== 
//signup moderator
router.post('/moderator/signup',moderatorSignupController)
//login moderator
router.post('/moderator/login',moderatorLoginController)
//moderator response
router.get('/moderator/get-users',verifyToken,isModerator,moderatorResponseController)
//verify or ban user
router.put('/moderator/updateVerification/:userId',verifyToken,isModerator,updateUser)

// =============Admin Routes========= 

//admin signup
router.post('/admin/signup',adminSignupController)
//login moderator
router.post('/admin/login',adminLoginController)
//admin response
router.get('/admin/get-users',verifyToken,isAdmin,adminResponseController)
//approval
router.put('/admin/updateApproval/:userId',verifyToken,isAdmin,updateUserModerator)






export default router;