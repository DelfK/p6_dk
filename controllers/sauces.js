const Sauces = require('../models/sauces');

const fs = require('fs');

exports.getSauces = (req, res, next) => {
    Sauces.find().then(
        (sauces) => {
          res.status(200).json(sauces);
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
};

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({
        _id: req.params.id
      }).then(
        (sauce) => {
          res.status(200).json(sauce);
        }
      ).catch(
        (error) => {
          res.status(404).json({
            error: error
          });
        }
      );

};

exports.createOneSauce = (req, res, next) => {
    const newSauce = JSON.parse(req.body.sauce)
    const sauce = new Sauces( {
        ...newSauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    );
    sauce.likes = 0;
    sauce.dislikes = 0;
    sauce.usersLiked = [];
    sauce.userDisliked = [];
    sauce.save()
    .then(
        () => {
            res.status(201).json(sauce)
        }
    )
    .catch(
        error => {
            res.status(400).json({error})
        }
    )


};

exports.updateOneSauce = (req, res, next) => {
    const sauce = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : req.body;

  Sauces.updateOne({ _id: req.params.id }, {...sauce, _id: req.params.id}) 
    .then(() => res.status(200).json())
    .catch(error => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(204).json())
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
}

exports.postLikes = (req, res, next) => {
    const pushUserByLike = (like, sauce) => {
        if ( sauce.usersLiked.includes(req.body.userId)){
            if (like === 0) {
                return {
                    usersLiked: sauce.usersLiked.filter( user => user !== req.body.userId),
                    likes: sauce.usersLiked.length - 1
                }
            }
        } else if (like === 1) {
            return {
                likes: sauce.usersLiked.push(req.body.userId),
                usersLiked: sauce.usersLiked
            };
        };

        if ( sauce.userDisliked.includes(req.body.userId)){
            if (like === 0) {
                return {
                    userDisliked: sauce.userDisliked.filter( user => user !== req.body.userId),
                    dislikes: sauce.userDisliked.length - 1
                }
            }
        } else if (like === -1) {
            return {
                dislikes: sauce.userDisliked.push(req.body.userId),
                userDisliked: sauce.userDisliked
            };
        };
  
    }
    Sauces.findOne({ _id: req.params.id})
    .then( sauce => {
        return pushUserByLike(req.body.like, sauce);
        
    })
    .then ( push => {
        Sauces.updateOne({ _id: req.params.id }, { $set: {...push, } })
        .then (
            res.json({message: push})
        )
        .catch (
            error => res.status(400).json({error})
        )
        
    })
    .catch ( error => {
        res.status(404).json({error})
    })

};