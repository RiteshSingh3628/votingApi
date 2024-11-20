const express = require('express')
const router = express.Router()
const User = require('../modals/User');
const { genToken,jwtAuthMiddleware } = require('../jwt');

// user login router
router.post('/signup',(req,res)=>{
    const data = req.body//capturing the 
    // create a new user using the mongoose model
    const newUser = new User(data);
    // saving the new user in the database
    newUser.save()
    .then((response)=>{
        
        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload))
        // sending the payload through jwt token
        
        const token = genToken(payload)
        res.status(200).json({message:"user created successfully",user:response,token:token})
    })
    .catch(err=>{
        res.status(400).json({error:err.message})
    })

})

// login route

router.post('/login',(req,res)=>{
    const {aadharCardNumber,password} = req.body;
    //find user by its username 
    User.findOne({aadharCardNumber:aadharCardNumber})
    .then(response=>{
        if(!response || !response.comparePassword(password)){
            return res.status(401).json({message:"Invalid username or password"})
        }
        // generate token
        const payload = {
            id:id
        }
        const token = genToken(payload);
    })
    .catch(err=>{
        res.status(500).json({error:'Internal server'})
    })

    
})

//User profile data route 
router.get('/profile',jwtAuthMiddleware,(req,res)=>{
    const userData = req.user;
    const userid = userData.id
    User.findById(userid)
    .then( data=>{

        res.status(200).json({data})
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:"Internal server error"})
    })
})

module.exports = router;