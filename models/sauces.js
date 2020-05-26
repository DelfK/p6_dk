const mongoose = require('mongoose');



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
        userDisliked: { type: [String], default: undefined }
    }
);



module.exports = mongoose.model('Sauces', sauceSchema);

