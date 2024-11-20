const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


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


// This is a middleware which will come to effect when we are saving data to database
userSchema.pre('save',async function(next){
    // before saving all the data is stored in this user object
    const user = this
    if(!user.isModified('password')) return next();
    try{
        // generating hashed password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password,salt)
        user.password = hashedPassword;
        next()
    }
    catch(err){
        throw err;
    }

})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword,this.password)
        return isMatch
    }
    catch(err){
        throw err;
    }
}


const User = mongoose.model('Users',userSchema);
module.exports = User;