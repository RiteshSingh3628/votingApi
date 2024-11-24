// including required libraries
const bodyParser = require('body-parser');
const express  = require('express');
const UserRoutes = require('./routes/userRoutes')
require('dotenv').config();
require('./db');

// PORT for local
PORT = process.env.PORT

// creating app object
const app = express()

// using body-pareser to parse the data 
app.use(bodyParser.json())
app.get('/',(req,res)=>{res.send("Welcome to vote management system")})

// use the routers
app.use('/user',UserRoutes)


//Listning to port 
app.listen(PORT,()=>{
    console.log(`Listing to the port ${PORT}`)

})