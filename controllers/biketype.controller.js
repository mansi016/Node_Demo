const db = require("../models/main");
const BikeType = db.BikeType;
const User = db.User;
const secret = "usertoken";
const jwt = require("jsonwebtoken");

exports.findAll = (req, res) => {
    const isDeleted = 0;
    BikeType.findAll({
        where:
            { isDeleted: isDeleted }
    }).then(data => {
        if (data == '') {
            res.status(204).send({
                message: "No Data Found!!"
            });
        }
        else {
            res.status(200).send(data);
        }
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Bike Types."
        });
    });
};

exports.create = (req, res) => {
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
        const useremail = decoded.EmaiID;
        const roleid = decoded.RoleID;
        if (roleid == 1)
        {
            User.findOne({
                where:
                    { EmaiID: useremail }
            }).then(data => {
                const uid = data.UserID;

                if (!req.body.BikeType) {
                    res.status(400).send({
                        message: "Content can not be empty!"
                    });
                    return;
                }

                const biketype = {
                    BikeType: req.body.BikeType,
                    CreatedBy: uid,
                    UpdatedBy: uid
                };

                BikeType.create(biketype).then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while adding bike type."
                    });
                });
            });
        }
        else {
            res.send({
                message: "Only admin can add bike types!"
            });
        }
    });
};