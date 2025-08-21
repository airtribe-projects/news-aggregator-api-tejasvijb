const express = require("express");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");
const axios = require("axios");

const router = express.Router();

// Get news based on user preferences
const newapiCategories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
];

router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Mock news data based on user preferences
        // In a real app, this would fetch from external APIs

        if (!user.preferences || user.preferences.length === 0) {
            return res.status(400).json({ message: "No preferences set" });
        }

        // Validate user preferences
        const invalidPreferences = user.preferences.filter(
            (pref) => !newapiCategories.includes(pref)
        );
        if (invalidPreferences.length > 0) {
            return res.status(400).json({
                message:
                    "Invalid preferences, must only include valid categories",
                invalidPreferences,
                validCategories: newapiCategories,
            });
        }

        // Fetch news for each preference in parallel
        const newsPromises = user.preferences.map(async (category) => {
            const response = await axios.get(
                "https://newsapi.org/v2/top-headlines",
                {
                    params: {
                        category,
                        apiKey: process.env.NEWS_API_KEY,
                    },
                }
            );
            return { category, articles: response.data.articles };
        });

        // Wait for all promises
        const results = await Promise.allSettled(newsPromises);

        const news = results.map((result) => {
            if (result.status === "fulfilled") {
                return result.value;
            } else {
                console.error("Error fetching news:", result.reason);
                return { category: result.category, articles: [] };
            }
        });

        res.json({ news });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
