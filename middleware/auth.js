const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token
 * Places the user ID in req.user.userId if token is valid
 */
const authMiddleware = (req, res, next) => {
    // Get token from header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Authorization header missing or malformed" });
    }
    const token = authHeader.split(" ")[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user from payload
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;
