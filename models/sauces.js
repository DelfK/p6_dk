const mongoose = require('mongoose');


// create the data model of the sauce
const sauceSchema = mongoose.Schema(
    {
        userId : { type: String, required: true},
        name : { type: String, required: true},
        manufacturer: { type: String, required: true},
        description: { type: String, required: true},
        mainPepper: { type: String, required: true},
        imageUrl: { type: String, required: true},
        heat: { type: Number, required: true},
        likes : Number,
        dislikes: Number,
        usersLiked : { type: [String], default: undefined },
        usersDisliked: { type: [String], default: undefined }
    }
);


// export the model
module.exports = mongoose.model('Sauces', sauceSchema);

