import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req,res)=>{
    try{
        const {name , email , password}= req.body;

        const checkExistingUser = await User.findOne({email});

        if(checkExistingUser){
            return res.status(409).json({
                success : false,
                message : 'User already exists'
            })
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newlyCreatedUser  = await User.create({
            name ,
            email ,
            password : hashedPassword
        })

        if(newlyCreatedUser){
            return res.status(201).json({
                success : true,
                message : "User successfully registered",
                data : newlyCreatedUser
            })
        }

        return res.status(500).json({
            success : false,
            message : "User is unable to register"
        })
    }

    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : 'Unable to register user'
        })
    }
}

export const loginUser = async (req,res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(500).json({
                success : false,
                message : "Please enter email or password"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }

        const checkPassword =  await bcrypt.compare(password , user.password);

        if(!checkPassword){
            return res.status(401).json({
                success : false,
                message : "Password is incorrect"
            })
        }

        const token = jwt.sign({
            userid : user._id
        },process.env.JWT_TOKEN_KEY , {
            expiresIn : '45m'
        })  

        res.cookie('token',token ,{
            httpOnly : true,
            secure :  process.env.NODE_ENV === 'production',
            sameSite :'strict',
            maxAge : 45*60*60
        })

        return res.status(200).json({
            success : true,
            message : "User logged in successfully",
            token
        })
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Unable to login user"
        })
    }
}

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.userid).select("-password");

  res.status(200).json({
    success: true,
    user,
  });
};
