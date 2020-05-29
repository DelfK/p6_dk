
// import DOTENV to hide the id and pwd in the DB connection details
require('dotenv').config();

// import EXPRESS
const express = require('express')
const app = express();

//import CORS
const cors = require('cors');

// import BODY-PARSER to parse the json body of incoming requests
const bodyParser = require('body-parser');

// import mongoose to connect the DB
const mongoose = require('mongoose');

// setting the response header for the preflight requests
let optionsCors = { 
        //Access-Control-Allow-Origin CORS header from all domains with wildcard
        origin: "*",
        //Access-Control-Allow-Methods CORS header
        methods: "GET,PUT,POST,DELETE",
        // Access-Control-Allow-Headers CORS header
        allowedHeaders: "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"       
}

// cors default configuration is
/*
{
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
  }
*/

// allowing cors requests for all routes with configuration
app.use(cors(optionsCors));

// parse json body for all routes
app.use(bodyParser.json());

// serving static images frome the images folder with express static
  // using the path /images to load the images from the folder /images
  // getting the images from a static folder using the absolute path with the root folder dirname
  // result > https://localhost:3000/images/[filename]
app.use('/images', express.static(__dirname + '/images'));

// import routes
const router = require('./routes/api');

// mount the routes on /api path
app.use('/api', router);

// Connect to DB using the env configuration
mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true})
  .then(() => console.log('Connected to DB!'))
  .catch(() => console.log('Connection failed!'));


// exports app
module.exports = app;
