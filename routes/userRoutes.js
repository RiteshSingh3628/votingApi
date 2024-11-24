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

router.post('/login',async(req,res)=>{

    try{
        const {aadharCardNumber,password} = req.body;
        //find user by its username 
        const user = await User.findOne({aadharCardNumber:aadharCardNumber})
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message:"Invalid username or password"})
        }
        // generate token
        const payload = {
            id:user.id
        }
        const token = genToken(payload);
        res.status(200).json({token})
        

    } 
    catch(err){
        res.status(500).send("Internal server error")
    }

    
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

// reset password router
router.put('/profile/password',jwtAuthMiddleware,async (req,res)=>{
    try{

        const userId = req.user //Extracting id from token
        const {currentPassword,newPassword} = req.body//Extracing the new password and crrnt password from body
        
        // find the user by userID
        const user = await User.findById(userId)
        // If password does not match than return error
        
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({message:"Invalid username or password"})
        }
        // if current password is correct password then
        user.password = newPassword
        await user.save()
        console.log("Password updated successfully")
        res.status(200).json({message:"Password updated"})
    }
    catch(err){
        res.status(500).json({error:'Internal server'})

    }




})

module.exports = router;