import Bid from '../models/Bid.js'
import Gig from '../models/Gig.js';

export const createBid = async (req,res)=>{
    try{
        const {message} = req.body;
        
        const {gigId} = req.params;
        const freelancerId = req.user.userid;

        if(!message || message.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Message Field required"
            });
        }
        const checkGig = await Gig.findById(gigId);
        
        if(!checkGig){
            return res.status(404).json({
                success : false,
                message : "Gig not found"
            })
        }
        
        if(checkGig.ownerId.toString() === freelancerId){
            return res.status(403).json({
                success : false,
                message : "You cannot place bid on your own gig"
            })
        }

        const existingBid = await Bid.findOne({gigId , freelancerId});

        if(existingBid){
            return res.status(400).json({
                success : false,
                message : "You already placed a bid on this gig"
            })
        }

        const newBid = await Bid.create({
            gigId,
            freelancerId,
            message
        });

        return res.status(201).json({
            success : true,
            message : "Bid successfully placed",
            data : newBid
        })
    }
    catch(e){
        console.log(e);

        return res.status(500).json({
            success : false,
            message : "Unable to create bid"
        })
    }
}

export const getAllBids = async (req,res)=>{
    try{
        const {gigId} = req.params;
        const userId =  req.user.userid;
        
        const gig =  await Gig.findById(gigId);
    
        if(!gig){
            return res.status(404).json({
                success : false,
                message : "Gig not found"
            })
        }

        if(gig.ownerId.toString() !== userId){
            return res.status(400).json({
                success : false,
                message : "Not authorized "
            })
        }

        const allBidder = await Bid.find({gigId})
         .populate("freelancerId","name email")
         .sort({createdAt : -1});
        
        
         return res.status(200).json({
            success : true,
            message : "All bidder list for gig",
            data : allBidder
         });
    }    
    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Internal Server error"
        })
    }
}

export const hiring = async (req,res)=>{
    try{
        const {bidId} = req.params;
        
        const userId = req.user.userid;

        const bid = await Bid.findById(bidId);
    
        if(!bid){
            return res.status(404).json({
                success : false,
                message : "Bid not found"
            })
        }
    
        const getGig =  await Gig.findById(bid.gigId);
    
        if(!getGig){
            return res.status(404).json({
                success : false,
                message : "Gig not found"
            })
        }

        if(getGig.ownerId.toString() !== userId){
            return res.status(403).json({
                success : false,
                message : "You are not authorized"
            })
        }

        if(getGig.status === 'assigned'){
            return res.status(400).json({
                success : false,
                message : "Gig already assigned"
            })
        }

        getGig.status = 'assigned';
        await getGig.save();

        bid.status = 'hired';
        await bid.save();

        await Bid.updateMany({
            gigId : getGig._id,
            _id : { $ne:bidId }},
            {status :'rejected'}
        )

        return res.status(200).json({
            success : true,
            message : "Freelancer successfully hired"
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}
