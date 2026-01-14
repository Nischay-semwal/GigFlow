import Gig from "../models/Gig.js";

export const createGig = async (req ,res)=>{
    try{
        const {title , description , budget} = req.body;
    
        if(!title || !budget){
            return res.status(400).json({
                success : false,
                message : "Enter title  and budget"
            })
        }
    
        const newGig = await Gig.create({
            title ,
            description,
            budget,
            ownerId : req.user.userid
        });
    
        return res.status(201).json({
            success : true,
            message : "Gig created",
            data : newGig
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

export const getAllGig = async (req,res)=>{
    try{
        const {search} = req.query;
        
        const query = {
            status : 'open'
        }

        if(search){
            query.title = {$regex : search , $options :'i'};
        }
        const gigs = await Gig.find(query);

        return res.status(200).json({
            success : true,
            message : "List of all gig",
            data : gigs
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Unable to get gig"
        })
    }
}   

export const getSingleGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch gig",
    });
  }
};
