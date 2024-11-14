// creating mongooose conecction file
const mongoose = require('mongoose')
const mongoURL = 'mongodb://localhost:27017/votings'
mongoose.connect(mongoURL)

db = mongoose.connection

db.on('connected',()=>{
    console.log("Connected to database votings...");
})
db.on('disconnected',()=>{
    console.log('Disconnected to database...')
})
db.on('error',(err)=>{
    console.log('connection error to database ',err);
})

module.exports = db;