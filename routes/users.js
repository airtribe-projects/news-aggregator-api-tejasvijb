const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Signup
// modify to include and add preferences
// add checks for input validation middleware for email, password, and preferences

const validateSignup = (req, res, next) => {
    const { name, email, password, preferences } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email and password are required" });
    }
    // Make preferences optional with default empty array
    req.body.preferences = preferences || [];
    // Make name optional with default value
    req.body.name = name || email.split("@")[0];
    next();
};

router.post("/signup", validateSignup, async (req, res) => {
    try {
        const { name, email, password, preferences } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            preferences,
        });
        await user.save();
        res.status(200).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Create and sign JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get user preferences
router.get("/preferences", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ preferences: user.preferences });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update user preferences
router.put("/preferences", authMiddleware, async (req, res) => {
    try {
        const { preferences } = req.body;
        if (!Array.isArray(preferences)) {
            return res
                .status(400)
                .json({ message: "Preferences must be an array" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { preferences },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Preferences updated successfully",
            preferences: user.preferences,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
