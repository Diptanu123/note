const express = require("express");
const dotenv = require("dotenv");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary");

dotenv.config();

const router = express.Router();

const storage = multer.memoryStorage();
var upload = multer({
    storage: storage
});

//Signup Route
const signup = async (req, res) => {
    try {
        const { firstName, lastName, userBio, userEmail, userMobile, userName } = req.body;

        // If current user exists

        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            res.status(401).send("User Already Exists with this email");
        }

        // Check if file is provided
        if (!req.file) {
            return res.status(400).json({ error: "No Profile Image Provided" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);        
        // Password extraction: The password (mySecret123) is extracted from req.body.userPassword.

        // Salt generation: A random salt is generated by bcrypt.genSalt(saltRounds).
        
        // Password hashing: The password and salt are hashed using bcrypt.hash(password, salt), resulting in an encrypted password (hashed string).
        const password = req.body.userPassword;
        const saltRounds = 10;

        const salt = await bcrypt.genSalt(saltRounds);
        //A salt is a random string added to the password before hashing.

        //Hashing is the process of converting data (like a password or a file) into a fixed-length string of characters, which is typically a sequence of numbers and letters. This string is called a hash. A hash is usually generated by a mathematical algorithm and is meant to uniquely represent the original data.

        const encryptedPassword = await bcrypt.hash(password, salt);
        console.log("Request Body: ", req.body);

//         When you use new User({...}), you can define middleware in Mongoose that automatically processes data before saving. For instance:

// Hashing the user's password before saving it (as seen in your previous example).
// Automatically setting fields like createdAt and updatedAt timestamps.
// This saves you from having to write repetitive code every time a new user is created.

        const newUser = new User({
            firstName,
            lastName,
            userBio,
            userEmail,
            userMobile,
            userName,
            userPassword: encryptedPassword,
            profileImage: result.secure_url
        });

        await newUser.save();

        return res.status(200).json({
            status: "Ok",
            user: newUser
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
};

const login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;
        // console.log(userEmail);

        const user = await User.findOne({ userEmail });

        if (user) {
            const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
            if (passwordMatch) {
                return res.json(user);
            } else {
                return res.json({ status: "Error", getUser: false })
            }
        } else {
            return res.json({ status: "Error", getUser: false });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { signup, login };