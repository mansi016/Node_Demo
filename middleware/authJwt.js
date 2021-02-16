const jwt = require("jsonwebtoken");
const secret = "usertoken";
const db = require("../models/user.model");
const User = db.User;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.EmaiID = decoded.EmaiID;
        next();
    });
};

module.exports = {
    verifyToken: verifyToken
};