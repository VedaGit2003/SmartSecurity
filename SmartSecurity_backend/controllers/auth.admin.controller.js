import { UserModel } from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import mongoose from "mongoose";
import { generateJwtSetCookie } from "../utils/jwtgenerator.js";
import { sendPasswordResetEmail, sendResetSuccessfullEmail, sendVerificationEmail, sendWelcomeMail } from "../mailtrap_config/emails.js";


export const adminSignupController = async (req, res) => {
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
            role: "admin",
            last_login: Date.now(),
            isVerified: true,
            isApproved: false,
            verificationToken: undefined,
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
export const adminLoginController = async (req, res) => {
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
            return res.status(402).json({ success: false, message: "You are not approved by the super admin yet" })
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


//get moderator and user details
export const adminResponseController = async (req, res) => {
    try {
        const moderatorsAndUsers = await UserModel.find({ role: { $in: ['user', 'moderator'] } });
        if (!moderatorsAndUsers) {
            return res.status(401).json({ success: false, message: "no user available" })
        }
        return res.status(200).json({ success: true, message: "user getting successfull", moderatorsAndUsers })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ success: false, message: "Network error" })
    }
}

//update moderator or user approval
export const updateUserModerator = async (req, res) => {
    try {
        const { userId } = req.params
        const { isApproved } = req.body

        // Validate `userId`
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(500).json({ success: false, message: "Invalid user ID format." });
        }

        //checking the input 
        if (typeof isApproved !== 'boolean') {
            return res.status(400).json({ success: false, message: "Invalid 'isApproved' value. It must be a boolean." });
        }

        const user = await UserModel.findById(userId)
        //check if user is valid
        if (!user) {
            return res.status(401).json({ success: false, message: "user is not available please provide valid id" })
        }
        if (user.role == 'admin') {
            return res.status(402).json({ success: false, message: 'You donot have the parmission to approve to an admin' })
        }
        //approve the user
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isApproved }, { new: true })
        //return response
        return res.status(200).json({
            success: true,
            message: 'User approval updated successfully',
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ success: false, message: 'Error while updating approval' })
    }
}