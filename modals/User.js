const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        enum:['male','female','other'],
        required: true

    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        
    },
    mobile:{
        type:String

    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
}) 


const User = mongoose.model('Users',userSchema);
module.exports = User;