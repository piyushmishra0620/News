const users=require('../model/users');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

const signup= async (req,res)=>{
    try{
        const {username,email,password}=req.body;
        const existinguser=await users.findOne({emailid:email});
        if(existinguser){
            return res.status(400).json({error:"User already exists with this email."});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedpassword= await bcrypt.hash(password,salt);
        const user=await users.create({username:username,emailid:email,password:hashedpassword});
        const token=jwt.sign({id:user._id,email:user.emailid,password:user.password,username:user.username},process.env.JWT_SECRET);
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:12*365*24*60*60*1000,
            expires:new Date(Date.now()+12*365*24*60*60*1000),
            sameSite:"Strict",
            domain:"vercel.app",
            secure:true
        });
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:12*365*24*60*60*1000,
            expires:new Date(Date.now()+12*365*24*60*60*1000),
            domain:"netlify.app",
            sameSite:"Strict",
            secure:true
        });
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:12*365*24*60*60*1000,
            expires:new Date(Date.now()+12*365*24*60*60*1000),
            sameSite:"Strict",
            secure:true
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal server error."});
    }
}

const login = async(req,res)=>{
    try{
        const {email,password}=req.body;
        const existinguser = await users.findOne({emailid:email});
        if(!existinguser){
            return res.status(400).json({error:"User not found with this email-id."});
        }
        const check = await bcrypt.compare(password,existinguser.password);
        if(!check){
            return res.status(400).json({error:"Incorrect password given."});
        }
        const token = jwt.sign({id:existinguser._id,username:existinguser.username,email:existinguser.emailid,password:existinguser.password});
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"Strict",
            domain:"vercel.app",
            maxAge:12*365*24*60*60*1000,
            expires:new Date(Date.now()+12*365*24*60*60*1000)
        });
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"Strict",
            domain:"netlify.app",
            maxAge:12*365*24*60*60*1000,
            expires:new Date(Date.now()+12*365*24*60*60*1000)
        });
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"Strict",
            maxAge:12*365*24*60*60*1000,
            expires:new Date(Date.now()+12*365*24*60*60*1000)
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal server error."});
    }
}

const getuser = async(req,res)=>{
    try{
        const user=req.body.user;
        if(!user){
            return res.status(401).json({error:"Unauthoized access."});
        }
        return res.status(200).json({user:user});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal server error."});
    }
}

module.exports={signup,login,getuser};