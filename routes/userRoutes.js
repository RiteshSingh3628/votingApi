const express = require('express')
const router = express.Router()
const User = require('../modals/User');

// user login router
router.post('./signup',(req,res)=>{
    const data = req.body//capturing the data
    const newUser = new User(data);
    newUser.save()
    .then((resp)=>{
        
    })

})