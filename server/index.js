const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./Routes/auth");
const noteRoutes = require("./Routes/notes");

const app = express();
const PORT = 6969;

dotenv.config();// When you call dotenv.config(), it reads the .env file and makes those variables accessible via process.env, allowing you to use them throughout your project.
app.use(cors(
    {
        origin:["https://notefrontend-kohl.vercel.app/"],
        methods:["POST","GET"],
        credentials:true
    }
)); //app.use(cors()) is a middleware function in Node.js/Express used to enable CORS (Cross-Origin Resource Sharing). CORS allows your server to accept requests from different origins (domains, protocols, or ports), which is necessary when your front-end (e.g., React app) is hosted on a different domain or port than your back-end API.
app.use(bodyParser.json()); //app.use(bodyParser.json()) is middleware in Express that parses incoming requests with JSON payloads. It is commonly used when you expect the client to send JSON data in the body of an HTTP request (e.g., in a POST request).
app.use(express.json()); // built in middleware or request handler, no need to install this lib.

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://notefrontend-kohl.vercel.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  

try {
    mongoose.connect(process.env.MONGO_URL);
    console.log(" Connection Successfull");
} catch (error) {
    console.log(error);
}

app.get("/", (req, res) => {
    res.send("Server Is Running");
});

app.use("/auth", authRoutes); //.use mount middleware When you use app.use(), you are telling Express to apply the provided middleware or router to every request that matches the specified path (in this case, /auth).
app.use("/notes", noteRoutes); //"/notes" is the base path for the group of routes defined in the noteRoutes module.
app.use("/files", express.static("files"));
// app.use("/files", ...): This sets up middleware in your Express app. Any request that starts with /files will be handled by this middleware.
// express.static("files"): This serves static files from the "files" directory on your server. Static files include images, CSS files, JavaScript files, PDFs, etc.
// Purpose:
// This line of code tells Express to serve static files (such as images, PDFs, or other assets) from the "files" directory when the user accesses URLs that start with /files.

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
})