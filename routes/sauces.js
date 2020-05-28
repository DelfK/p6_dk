const sauceRouter = require('express').Router();

const Sauces = require('../models/sauces');

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');


// routes
sauceRouter.get('/', saucesCtrl.getSauces);

sauceRouter.get('/:id', saucesCtrl.getOneSauce)

sauceRouter.post('/', auth, multer, saucesCtrl.createOneSauce)

sauceRouter.put('/:id', auth, multer, saucesCtrl.updateOneSauce);

sauceRouter.delete('/:id', auth, multer, saucesCtrl.deleteOneSauce);
    
sauceRouter.post('/:id/like', auth, saucesCtrl.postLikes)


module.exports = sauceRouter;