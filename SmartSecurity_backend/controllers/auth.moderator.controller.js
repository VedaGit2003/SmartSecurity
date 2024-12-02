import { UserModel } from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { generateJwtSetCookie } from "../utils/jwtgenerator.js";
import { sendPasswordResetEmail, sendResetSuccessfullEmail, sendVerificationEmail, sendWelcomeMail } from "../mailtrap_config/emails.js";

export const moderatorSignupController = async (req, res) => {
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
        // const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        //creating new user
        const user = new UserModel({
            email,
            password: hashedPassword,
            name,
            role: "moderator",
            last_login: Date.now(),
            isVerified:true,
            isApproved: false,
            verificationToken:undefined,
            verificationTokenExpiresAt: undefined
        })
        //save the user
        await user.save()
        //generate jwt and save cookie
        generateJwtSetCookie(res, user._id)

        //send verification emails
        // await sendVerificationEmail(user.email, verificationToken)

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
export const moderatorLoginController = async (req, res) => {
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





//geting all users
export const moderatorResponseController=async(req,res)=>{
    try{
        const users=await UserModel.find({role:'user'})
        if(!users){
            return res.status(401).json({success:false,message:"no user available"})
        }
        return res.status(200).json({success:true,message:"user getting successfull",users})
    }catch(error){
        console.log(error)
        return res.status(404).json({success:false,message:"Network error"})
    }
}
