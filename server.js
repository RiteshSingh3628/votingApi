// including required libraries
const bodyParser = require('body-parser');
const express  = require('express');
require('dotenv').config();
require('./db');

// PORT for local
PORT = 3000

// creating app object
const app = express()

// using body-pareser to parse the data 
app.use(bodyParser.json())


app.listen(PORT,()=>{
    console.log(`Listing to the port ${PORT}`)

})