import mongoose from "mongoose";

export const connectToDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    }
    catch(e){
        console.log('Database connection failed');
        process.exit(1);
    }
}