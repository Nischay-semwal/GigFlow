import mongoose from 'mongoose';

const GigSchema = new mongoose.Schema({
    title : {
        type : String,
        trim : true,
        required : true,
        index : true
    },
    description : {
        type : String,
        trim : true
    },
    budget : {
        type : Number,
        required : true,
        min : 0
    },
    ownerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    status : {
        type : String,
        enum : ['open','assigned'],
        default : 'open'
    }
},{timestamps : true});

export default mongoose.model('Gig',GigSchema);