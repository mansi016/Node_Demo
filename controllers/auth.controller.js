const db = require("../models/main");
const User = db.User;
const Role = db.Role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    if (!req.body.Username || !req.body.Password || !req.body.EmaiID || !req.body.RoleID || !req.body.DOB || !req.body.Gender || !req.body.ContactNo || !req.body.Address) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const user = {
        Username: req.body.Username,
        Password: bcrypt.hashSync(req.body.Password, 8),
        EmaiID: req.body.EmaiID,
        RoleID: req.body.RoleID,
        DOB: req.body.DOB,
        Gender: req.body.Gender,
        ContactNo: req.body.ContactNo,
        Address: req.body.Address,
        isDeleted: req.body.isDeleted
    };

    User.create(user)
        .then(data => {
            res.status(200).send("User Registered Successfully !!");
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while registering user."
            });
        });
};

exports.signin = (req, res) => {
    User.findOne({ where: { EmaiID: req.body.EmaiID } })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.Password,
                user.Password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const secret = "usertoken";
            const token = jwt.sign({ EmaiID: user.EmaiID, RoleID: user.RoleID }, secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                UserID: user.id,
                Username: user.Username,
                EmaiID: user.EmaiID,
                RoleID: user.RoleID,
                accessToken: token
            });
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
};