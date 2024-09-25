const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userBio: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userMobile: {
        type: Number,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", userSchema);

//  Purpose: This creates a Mongoose model named "User" based on the provided userSchema.
// "User": This is the name of the model. Mongoose will look at this name to create a collection in the database (in this case, it will look for a collection called users because Mongoose automatically pluralizes the model name).