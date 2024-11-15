const jwt = require('jsonwebtoken')
require('dotenv').config();

// creating a middleware to verify token
const jwtAuthMiddleware = (req,res,next) =>{
    const authorization = req.headers.authorization
    if(!authorization) return req.status(401).json({error:"Token not found"});

    const Token = req.headers.authorization.split(' ')[1];
    if(!Token) return req.status(401).json({error:"Unautorized"});

    try{
        const decoded = jwt.verify(Token,process.env.JWT_SECRET);
        req.user = decoded
        next()
    }
    catch(err){
        console.error(err);
        res.status(401).json({error:"Invalid token"})
    }
}


// generating token
const genToken = (userData)=>{
    return jwt.sign(userData,process.env.JWT_SECRET,{expireIn:300000})
}

module.exports = {genToken,jwtAuthMiddleware};