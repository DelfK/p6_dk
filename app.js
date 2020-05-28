
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
// equivalent de :
/*app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
*/

// requests body parsing
app.use(bodyParser.json());

const path = require('path');

// serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
    res.send('We are on 3000 baby');
});

// import routes
const router = require('./routes/api');

app.use('/api', router);


//Listening on PORT 3000
//app.listen(process.env.DB_PORT || 3001, () => {
//console.log('Server listening on port 3000!')
//});

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true})
  .then(() => console.log('Connected to DB!'))
  .catch(() => console.log('Connection failed!'));


// exports app
module.exports = app;
