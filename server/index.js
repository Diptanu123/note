const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./Routes/auth");
const noteRoutes = require("./Routes/notes");

const app = express();
const PORT = 6969;

dotenv.config();

// Configure CORS
const corsOptions = {
    origin: 'https://notefrontend-kohl.vercel.app', // Allow only your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS settings
app.use(bodyParser.json());
app.use(express.json()); 

// MongoDB connection
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connection to MongoDB successful");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
})();

// Routes
app.get("/", (req, res) => {
    res.send("Server Is Running");
});

app.use("/auth", authRoutes); 
app.use("/notes", noteRoutes);
app.use("/files", express.static("files"));

// Start the server
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
