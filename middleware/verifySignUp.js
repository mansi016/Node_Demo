const db = require("../models/main");
const User = db.User;

checkDuplicateEmail = (req, res, next) => {
    User.findOne({
        where: {
            EmaiID: req.body.EmaiID
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Sign-up Failed! Email is already in use!"
            });
            return;
        }
        next();
    });
};

module.exports = {
    checkDuplicateEmail: checkDuplicateEmail
};