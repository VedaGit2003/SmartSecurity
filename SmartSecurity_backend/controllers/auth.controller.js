

export const userSignupController=async(req,res)=>{
    res.status(200).json({success:true,message:'user signup successfull'})
}

export const userLoginController=async(req,res)=>{
    res.status(200).json({success:true,message:'user login successfull'})
}


export const userLogoutController=async(req,res)=>{
    res.status(200).json({success:true,message:'user logout successfull'})
}