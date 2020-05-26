const apiRouter = require('express').Router();
const sauceRouter = require('./sauces');
const userRouter = require('./user');

apiRouter.use('/sauces', sauceRouter);
apiRouter.use('/auth', userRouter);


module.exports = apiRouter;


