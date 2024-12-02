import jwt from 'jsonwebtoken'

export const generateJwtSetCookie = (res, userId) => {
    //generate the jwt 
    const token = jwt.sign({ userId }, process.env.JWT_SECRET,
        { expiresIn: '15d' }
    )
   
    //setting up the cookie
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:'strict',
        maxAge:15*60*60*1000
    })

    return token;
}

