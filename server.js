
// import dotenv to hide the connection authentification details
require('dotenv').config();

// import express to create the server
const express = require('express')
const app = express();

//import cors
const cors = require('cors');

const bodyParser = require('body-parser');

// import mongoose to connect to DB
const mongoose = require('mongoose');

// use cors
app.use(cors());

app.use(bodyParser.json());

const path = require('path');

// serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));


// import routes
const router = require('./routes/api');
app.use('/api', router);


//Listening on PORT 3000
app.listen(process.env.DB_PORT || 3001, () => {
  console.log('Server listening on port 3000!')
});

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true})
  .then(() => console.log('Connected to DB!'))
  .catch(() => console.log('Connection failed!'));



