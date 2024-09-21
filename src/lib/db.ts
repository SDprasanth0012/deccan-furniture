import mongoose from "mongoose";
const mongodb_uri = process.env.MONGODB_URI?.toString()

const connectDB = async()=>{
    const connectionState = await mongoose.connection.readyState

    if(connectionState ===1 ){
        console.log("already Connected to MongoDB")
        return
    }
    if (connectionState ===2) {
        console.log("Reconnecting to MongoDB...")
        return
    }
    try {
        await mongoose.connect(mongodb_uri!, {
            dbName:'deccanDB',
            bufferCommands: true,
        })
        console.log("Connected to MongoDB")
    }catch (error:any) {
            console.log("Failed to connect to MongoDB",error)
            throw Error( error);
    }
 }

export default connectDB