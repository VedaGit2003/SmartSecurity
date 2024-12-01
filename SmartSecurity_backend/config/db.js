import mongoose from "mongoose";

export const connectDB=async()=>{
    try{
      const conn=await mongoose.connect(process.env.MONGODB_URI)
      //connected successfully
      console.log(`mongodb connected ${conn.connection.host}`)
    }catch(error){
        //failed to connece mongodb
        console.log("Mongodb not connected",error)
        process.exit(1)
    }
}