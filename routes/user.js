// create userRouter 
const userRouter = require('express').Router();

// import bcrypt
const bcrypt = require('bcrypt');

// import jsonwebtoken
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// USER ROUTES
// SIGNUP
userRouter.post('/signup', (req, res, next) => {
    // hash the password with bcrypt
    bcrypt.hash(req.body.password, 10)
    // then create the user with the crypted password and unique email
    .then( hash => {
        const user = new User ({
            email: req.body.email,
            password: hash
        });
    // save user to the DB 
    user.save()
    //then send the response to the client
    .then( () => { res.status(201)} )
    .catch( (error) => { res.status(400).json( { error } )} )
    
    })
    .catch( error => { res.status(500).json({error}) });
});

//LOGIN
userRouter.post('/login', (req, res, next) => {
    // search for the user in the DB
    User.findOne({ email: req.body.email })
    // then compare with bcrypt the password sent and the user password
    .then( user => {
        if(!user) {
            return res.status(401).json({error});
        }
        bcrypt.compare( req.body.password, user.password )
    // then if not valid throw an error
        .then( (valid) => {
            if(!valid){
                return res.status(401).json({error})
            }
            // if valid, send the response to the client with a token
            res.status(200).json({
                userId: user._id,
                // generate a token containing the user id and a secret key with the function sign
                token: jwt.sign(
                    { userId : user._id},
                    'RANDOM_TOKEN_SECRET',
                    // token expires after 24 hours
                    { expiresIn: '24h'}
                )
            })
        } )
        .catch( (error) => { res.status(500).json( { error } )} )
    })
    .catch( (error) => { res.status(500).json({ error }) }); 
});
    



// exports userRouter
module.exports = userRouter;