const users=require('../model/users');
const jwt=require('jsonwebtoken');

const protected= async (req,res,err,next)=>{
    try{
        const token = req.cookie?.token;
        if(!token){
            return res.status(401).json({error:"Unauthorized access."});
        }
        const decodetoken= jwt.verify(token,process.env.JWT_SECRET);
        req.body.user= await users.findById(decodetoken.id);
        next();
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Internal server error"});
    }
}

module.exports=protected;