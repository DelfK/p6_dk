const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//create the data model of the user
const userSchema = mongoose.Schema(
    {
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true}
    }
);

// use uniqueValidator  with key unique to check that emails are uniques
userSchema.plugin(uniqueValidator);

// export the model
module.exports = mongoose.model('User', userSchema);