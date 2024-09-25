const express = require("express");
const router = express.Router();
const NotesController = require("../Controllers/NotesController");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = "./files";
        cb(null, destinationPath); //null: This is the first argument passed to cb. It represents no error. By passing null, you are telling multer that everything is okay and there is no error in determining the destination for the file.
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({
    storage: storage
});

// Routes
router.post("/upload", upload.single("file"), NotesController.uploadNote); //upload.single("file") is middleware provided by Multer, a Node.js middleware for handling file uploads.file is the name of the field in the form data (from the client-side) that contains the file to be uploaded.
router.get("/getFiles", NotesController.getNote);
router.get("/getFiles/:id", NotesController.getNoteByID);

module.exports = router;