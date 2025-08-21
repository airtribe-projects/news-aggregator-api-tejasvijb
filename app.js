// Load environment variables at the very beginning
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const newsRouter = require("./routes/news");
const app = express();
const port = process.env.PORT || 3000;

// Check for required environment variables
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is not defined!");
}

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable is not defined!");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Routes
app.use("/users", usersRouter);
app.use("/news", newsRouter);

if (require.main === module) {
    app.listen(port, (err) => {
        if (err) {
            return console.error("Something bad happened", err);
        }
        console.log(`Server is listening on ${port}`);
    });
}

module.exports = app;
