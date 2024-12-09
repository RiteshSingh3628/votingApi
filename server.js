// including required libraries
const bodyParser = require('body-parser');
const express  = require('express');
const UserRoutes = require('./routes/userRoutes')
const CandidateRoutes = require('./routes/candidateRoutes')
require('dotenv').config();
require('./db');

// PORT for local
PORT = process.env.PORT


// middle ware




// creating app object
const app = express()

// using body-pareser to parse the data 
app.use(bodyParser.json())
app.get('/',(req,res)=>{res.send("Welcome to vote management system")})

// use the routers
app.use('/user',UserRoutes);
app.use('/candidate',CandidateRoutes);


//Listning to port 
app.listen(PORT,()=>{
    console.log(`Listing to the port ${PORT}`)

})