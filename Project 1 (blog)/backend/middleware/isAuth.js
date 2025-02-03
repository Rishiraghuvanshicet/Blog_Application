const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const isAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: "Token is missing" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({ msg: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

module.exports = isAuth;

