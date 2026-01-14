import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
    gigId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Gig'
    },
    freelancerId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    message : {
        type : String,
        required : true,
    },
    status :{
        type : String,
        enum : ['pending','hired','rejected'],
        default : 'pending'   
    }
},{timestamps : true})

export default mongoose.model('Bid',BidSchema);