const jwt = require("jsonwebtoken");
const mysql = require('mysql2');
const Sequelize = require("sequelize");
const db = require("../models/main");

const secret = "usertoken";
const Op = Sequelize.Op;
const Bike = db.Bike;
const User = db.User;

const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bikedb'
});

exports.findAll = (req, res) => {
    const isDeleted = 0;
    Bike.findAll({
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
                err.message || "Some error occurred while retrieving Bike Info."
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
        if (roleid == 1) //admin
        {
            User.findOne({
                where:
                    { EmaiID: useremail }
            }).then(data => {
                const uid = data.UserID;

                if (!req.body.BikeName || !req.body.BikePrice) {
                    res.status(400).send({
                        message: "Content can not be empty!"
                    });
                    return;
                }

                const bike = {
                    BikeName: req.body.BikeName,
                    BikeTypeID: req.body.BikeTypeID,
                    BikePrice: req.body.BikePrice,
                    CreatedBy: uid,
                    UpdatedBy: uid
                };

                Bike.create(bike).then(data => {
                    res.status(200).send(data);
                }).catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while adding bike info."
                    });
                });
            });
        }
        else {
            res.status(403).send({
                message: "Only admin can add bike information!"
            });
        }
    });
};

exports.findByID = (req, res) => {
    const id = req.params.id;
    const isDeleted = 0;
    Bike.findOne({
        where:
        {
            BikeID: id,
            isDeleted: isDeleted
        }
    }).then(data => {
        if (data == null) {
            res.status(204).send({
                message: "No Data Found!"
            });
        }
        else {
            res.status(200).send(data);
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error retrieving Bike info with id=" + id
        });
    });
};

exports.findByBikeType = (req, res) => {
    const id = req.params.id;
    const isDeleted = 0;
    Bike.findAll({
        where:
        {
            BikeTypeID: id,
            isDeleted: isDeleted
        }
    }).then(data => {
        if (data == '') {
            res.status(404).send({
                message: "Bike not found."
            });
        }
        else {
            res.status(200).send(data);
        }
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving bikes."
        });
    });
};

exports.update = (req, res) => {
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
        if (roleid == 1) {
            User.findOne({
                where:
                    { EmaiID: useremail }
            }).then(data => {
                const uid = data.UserID;

                const id = req.params.id;

                const bike = {
                    BikeName: req.body.BikeName,
                    BikeTypeID: req.body.BikeTypeID,
                    BikePrice: req.body.BikePrice,
                    CreatedBy: uid,
                    UpdatedBy: uid
                };

                Bike.update(bike, {
                    where: { BikeID: id }
                }).then(num => {
                    if (num == 1) {
                        res.send({
                            message: "Bike Information was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update Bike Information with id=${id}. Maybe Bike was not found or content is empty!`
                        });
                    }
                }).catch(err => {
                    res.status(500).send({
                        message: "Error updating Bike with id=" + id
                    });
                });
            });
        }
        else {
            res.send({
                message: "Only admin can add bike information!"
            });
        }
    });
};

exports.delete = (req, res) => {
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
        if (roleid == 1) {
            User.findOne({
                where:
                    { EmaiID: useremail }
            }).then(data => {
                const uid = data.UserID;
                const id = req.params.id;

                const bike = {
                    isDeleted: 1,
                    UpdatedBy: uid
                };

                Bike.update(bike, {
                    where: { BikeID: id }
                }).then(num => {
                    if (num == 1) {
                        res.send({
                            message: "Bike was deleted successfully!"
                        });
                    } else {
                        res.send({
                            message: `Cannot delete Bike with id=${id}. Maybe Bike was not found!`
                        });
                    }
                }).catch(err => {
                    res.status(500).send({
                        message: "Could not delete Bike with id=" + id
                    });
                });
            });
        }
        else {
            res.send({
                message: "Only admin can delete bike information!"
            });
        }
    });
};

exports.findRecentRegBikes = (req, res) => {
    const sql = "SELECT * FROM bikestbls WHERE isDeleted=0 AND createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW()";
    dbConn.query(sql, (err, result, fields) => {
        if (!err) {
            if (result == '') {
                res.status(404).send({
                    message: "No Reviews found!"
                });
            }
            else {
                res.status(200).send(result);
            }
        }
        else {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving bikes."
            });
        }
    });
};