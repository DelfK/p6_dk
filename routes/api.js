const apiRouter = require('express').Router();
const sauceRouter = require('./sauces');
const userRouter = require('./user');

// mount the  sauce routes on /api/sauces path
apiRouter.use('/sauces', sauceRouter);

// mount the  user routes on /api/auth path
apiRouter.use('/auth', userRouter);


//export the router
module.exports = apiRouter;


