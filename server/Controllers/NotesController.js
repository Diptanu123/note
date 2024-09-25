const express = require("express");
const dotenv = require("dotenv");
const Notes = require("../Models/Notes");
const multer = require("multer");
const path = require("path");

dotenv.config();

const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const uploadNote = async (req, res) => {
    try {
        const fileName = req.body.title;
        const fileDescription = req.body.description;
        const tags = req.body.tags;
        const file = req.file.filename;

        const uploadedBy = req.body.userId;
        console.log(uploadedBy);

        const newFile = new Notes({
            fileName: fileName,
            fileDescription: fileDescription,
            tags: tags,
            files: file,
            uploadedBy: uploadedBy
        });

        await newFile.save();
        res.send({ status: "Ok" });

    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
};

const getNote = async (req, res) => {
    try {
        const { title, tag } = req.query;
        const query = {};
        // In this case, if the request is /notes?title=example&tag=work, then:
        //  title will be "example",
        //   tag will be "work".

        if (title) {
            query.fileName = {
                $regex: title,//The use of $regex and $options: "i" in MongoDB is a way to perform pattern-based searches within text fields. Here’s a detailed explanation of each part:
                // 1. $regex:
                // Purpose: $regex is a MongoDB query operator that allows you to match documents where a specific field's value matches a regular expression (pattern).
                //This enables partial matches. For example, if the tag value is "work", it will match documents with tags like "work", "homework", or "network" because "work" appears in those strings.
                
                $options: "i"
                //Case-insensitive means that the search will not distinguish between uppercase and lowercase letters.
                //This means that the regular expression search on the tag field will ignore case. So, if you search for "work", it will match "Work", "WORK", "work", or "wOrK" without caring about letter casing.
            };
        };

        if (tag) {
            query.tag = {
                $regex: tag,
                $options: "i"
            };
        };

        const data = await Notes.find(query);
        res.send({ data: data });

    } catch (error) {
        console.log(error);
    }
};

const getNoteByID = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);

        await Notes.find({
            uploadedBy: userId
        }).then(data => {
            res.send({ data: data });
        })
//         Fetching Data: find allows you to retrieve data from the database based on certain criteria. Here, you want to retrieve all notes created or uploaded by a specific user, and find is the method used to query for that data.
// Multiple Results: The find method returns an array of documents (notes) that meet the condition. In contrast, methods like findOne would only return a single document.
// Example:
// If a user with userId = 123 has uploaded 5 notes, find({ uploadedBy: 123 }) will return those 5 notes. If the user hasn't uploaded any notes, it will return an empty array.

// Finally, when the data is found, it is passed to the then block, where the server sends the result back to the client as a response with res.send({ data: data }).
    } catch (error) {
        console.log(error);
    }
};

module.exports = { uploadNote, getNote, getNoteByID };