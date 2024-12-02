import { UserModel } from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { generateJwtSetCookie } from "../utils/jwtgenerator.js";
import { sendPasswordResetEmail, sendResetSuccessfullEmail, sendVerificationEmail, sendWelcomeMail } from "../mailtrap_config/emails.js";

//user signup controller
export const userSignupController = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(500).json({ success: false, message: 'All field required' })
        }
        //check if user exist of not
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(501).json({ success: false, message: 'User already exist' })
        }
        //encrypt the password
        const hashedPassword = await bcryptjs.hash(password, 10)
        //generate verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        //creating new user
        const user = new UserModel({
            email,
            password: hashedPassword,
            name,
            role: "user",
            last_login: Date.now(),
            isApproved: true,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
        })
        //save the user
        await user.save()
        //generate jwt and save cookie
        generateJwtSetCookie(res, user._id)

        //send verification emails
        await sendVerificationEmail(user.email, verificationToken)

        //sending the response 
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined
            },
        });

    } catch (error) {
        return res.status(404).json({ success: false, message: 'getting error while signup plese try again letter', error: error })
    }
}


//User Login
export const userLoginController = async (req, res) => {
    try {
        //access input
        const { email, password } = req.body;
        //check if user exist
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(500).json({ success: false, message: 'User not exists' })
        }

        //check the password
        const matchPassword = await bcryptjs.compare(password, user.password)

        if (!matchPassword) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }
        if (!user.isVerified) {
            return res.status(402).json({ success: false, message: "Your email is not verified" })
        }

        if (!user.isApproved) {
            return res.status(402).json({ success: false, message: "You are not approved by the admin yet" })
        }

        generateJwtSetCookie(res, user._id)
        user.last_login = new Date()
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: "Error while login please try again later"
        })
    }
}


//user Logout
export const userLogoutController = async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ success: true, message: 'user logged out successfully' })
}

//verification process
export const verificationController = async (req, res) => {
    try {
        //accessing email and code
        const { code } = req.body;

        //verify the code
        const user = await UserModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(500).json({ success: false, message: 'Code does not matched or expired' })
        }

        //setting values
        user.isVerified = true
        user.verificationToken = undefined,
            user.verificationTokenExpiresAt = undefined
        //save the changes
        await user.save()
        //sending welcome mail
        await sendWelcomeMail(user.email, user.name)
        //sending response
        return res.status(200).json({
            success: 'true',
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        })



    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: 'Verificaion error'
        })
    }
}

//forgot password

export const forgotPasswordController=async(req,res)=>{
    try{
      const {email}=req.body;
      //checking if user exist or not
      const user=await UserModel.findOne({email})

      if(!user){
        return res.status(400).json({ success: false, message: "User not found" });
      }
      //generate reset token
      const resetToken=crypto.randomBytes(20).toString("hex")
      const resetTokenExpiresAt=Date.now()+1*60*60*1000;

      user.resetPasswordToken=resetToken;
      user.resetPasswordExpiresAt=resetTokenExpiresAt;

      await user.save()

      //send email
      await sendPasswordResetEmail(user.email,`${process.env.FRONTEND_URL}/reset-password/${resetToken}`)

      res.status(200).json({
        success:true,
        message:'Password reset link sent to your email'
      })

    }catch(error){
        console.log(error)
        return res.status(404).json({
            success: false,
            message: 'Network error in forgot password'
        })
    }
}

//resetPassword Controller
export const resetPasswordController=async(req,res)=>{
    try{
        //accessing the token and password from frontend
       const {token}=req.params
       const {password}=req.body

       //check for valid token
       const  user=await UserModel.findOne({
        resetPasswordToken:token,
        resetPasswordExpiresAt:{$gt:Date.now()},
       })

       if (!user){
        return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
       }

       //update password
       const hashedPassword=await bcryptjs.hash(password,10);

       user.password=hashedPassword;
       user.resetPasswordToken=undefined;
       user.resetPasswordExpiresAt=undefined;
       //save the changes
       await user.save();
      //sending successfull email
       await sendResetSuccessfullEmail(user.email)
       
       //sending response
       res.status(200).json({
        success:true,
        message:"Password reset successful"
       })
    
    }catch(error){
        console.error(error)
        return res.status(404).json({
            success:false,
            message: 'Network error in reseting password'
        })
    }
}

export const checkAuthController=async(req,res)=>{
    try{
    const user=await UserModel.findById(req.userId).select("-password")
    if(!user){
        return res.status(400).json({
            success:false,message:"user not found"
        })
    }
    res.status(200).json({
        success:true,user
    })
    }catch(error){
        console.log("Error while checking authorization",error)
        res.status(404).json({
            success: false, message: error.message
        })
    }
}



