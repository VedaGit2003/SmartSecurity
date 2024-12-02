import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model.js";

//verify token and export userId
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if (!decode) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }
        req.userId = decode.userId;
        next()
    } catch (error) {
        console.log("Error in verifyToken ", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }

}


//check if moderator or not
export const isModerator = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId)
        // checking for user 
        if (!user) {
            return res.status(401).json({ success: false, message: 'user not exist' })
        }
        //checking for moderator
        if (user.role !== 'moderator') {
            return res.status(402).json({ success: false, message: 'You are not moderator' })
        }
        next()
    } catch (error) {
        console.log("Error in checking moderator ", error);
        return res.status(404).json({ success: false, message: "Server error while checking moderator" });
    }
}


// check if user is admin or not 
export const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId)
        // checking for user 
        if (!user) {
            return res.status(401).json({ success: false, message: 'user not exist' })
        }
        //checking for moderator
        if (user.role !== 'admin') {
            return res.status(402).json({ success: false, message: 'You are not admin' })
        }
        next()
    } catch (error) {
        console.log("Error in checking moderator ", error);
        return res.status(404).json({ success: false, message: "Server error while checking moderator" });
    }
}