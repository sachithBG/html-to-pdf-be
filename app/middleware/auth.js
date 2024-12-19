const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Access token required" });
    }

    // The Authorization header format should be "Bearer <token>"
    const token = authHeader.split(" ")[1];  // Extract the token after "Bearer"

    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
