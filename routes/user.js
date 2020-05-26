const userRouter = require('express').Router();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

userRouter.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then( hash => {
        const user = new User ({
            email: req.body.email,
            password: hash
        });
    user.save()
    .then( () => { res.status(201)} )
    .catch( (error) => { res.status(400).json( { error } )} )
    
    })
    .catch( error => { res.status(500).json({error}) });
});


userRouter.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then( user => {
        if(!user) {
            return res.status(401).json({error});
        }
        bcrypt.compare( req.body.password, user.password )
        .then( (valid) => {
            if(!valid){
                return res.status(401).json({error})
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId : user._id},
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h'}
                )
            })
        } )
        .catch( (error) => { res.status(500).json( { error } )} )
    })
    .catch( (error) => { res.status(500).json({ error }) }); 
});
    




module.exports = userRouter;