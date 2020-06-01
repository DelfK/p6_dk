//import the data models 
const Sauces = require('../models/sauces');

// import fs to manage and read the static files
const fs = require('fs');

// get all the sauces
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

// get a specific sauce
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

// submit a sauce and upload an image 
exports.createOneSauce = (req, res, next) => {
    // parsing the request body before creating the new instance of sauce
    // >> form-data to object
    const newSauce = JSON.parse(req.body.sauce)
    const sauce = new Sauces( {
        ...newSauce,
        // set the url where to find the image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    );

    sauce.likes = 0;
    sauce.dislikes = 0;
    sauce.usersLiked = [];
    sauce.usersDisliked = [];
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

// update a specific sauce
exports.updateOneSauce = (req, res, next) => {

    // check if there is a new file in the request
    const sauce = req.file ? {

        //if yes send the new url with the new filename
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        // if not send the body only
      } : req.body;

  // update the sauce in the DB
  Sauces.updateOne({ _id: req.params.id }, {...sauce, _id: req.params.id})

  /* ...sauce equal {
        name : req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description, 
        mainPepper: req.body.mainPepper
  }*/
    .then(() => res.status(200).json())
    .catch(error => res.status(400).json({ error }));
};


// delete a specific sauce from the static file and the DB
exports.deleteOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
    .then(sauce => {

    // get and save the filename
      const filename = sauce.imageUrl.split('/images/')[1];

      // remove the file from /images and delete it from DB
      fs.unlink(`images/${filename}`, () => {

        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(204).json())
          .catch(error => res.status(400).json({ error }));

      });
    })
    .catch(error => res.status(500).json({ error }));
}


// submit like and dislikes
exports.postLikes = (req, res, next) => {

    
    const pushUserByLike = (like, sauce) => {
        // check if the user already likes the sauce
        if ( sauce.usersLiked.includes(req.body.userId)){
            // if yes and if he cancels his like
            if (like === 0) {
                return {
                    // delete the userId from the array usersLiked
                    usersLiked: sauce.usersLiked.filter( user => user !== req.body.userId),
                    // decrease by one the total of likes
                    likes: sauce.usersLiked.length - 1
                }
            }
        // if not
        } else if (like === 1) {
            return {
                // add the userId to the usersLiked array and get the new total of likes with the length of the array
                // length = return value of push
                likes: sauce.usersLiked.push(req.body.userId),
                // save the updated array
                usersLiked: sauce.usersLiked
            };
        };
        
        // check if the user already dislikes the sauce
        if ( sauce.usersDisliked.includes(req.body.userId)){
            // if yes and if he cancels his dislikes
            if (like === 0) {
                return {
                    // delete the userId from the usersDisliked array
                    usersDisliked: sauce.usersDisliked.filter( user => user !== req.body.userId),
                    // decrease by one the total of dislikes
                    dislikes: sauce.usersDisliked.length - 1
                }
            }
        // if not
        } else if (like === -1) {
            return {
                // add the userId to the usersDisliked array and get the new total of dislikes with the length of the array
                // length = return value of push
                dislikes: sauce.usersDisliked.push(req.body.userId),
                // save the updated array
                usersDisliked: sauce.usersDisliked
            };
        };
  
    }
    // find the sauce with its id in the DB
    Sauces.findOne({ _id: req.params.id})
    // get the sauce and use it in next promise
    .then( sauce => {
        // call the function with 
        return pushUserByLike(req.body.like, sauce);  
    })
    // Get the return value of pushUserByLike and update the DB it
    .then ( push => {
        // replace the values only the usersLikes/usersDislikes array and likes/dislikes keys
        Sauces.updateOne({ _id: req.params.id }, { $set: {...push} })
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