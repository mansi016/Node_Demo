const mysql = require('mysql2');
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const db = require("../models/main");

const BikeReview = db.BikeReview;
const User = db.User;
const Op = Sequelize.Op;
const secret = "usertoken";

const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bikedb'
});

exports.findAll = (req, res) => {
    const isDeleted = 0;
    BikeReview.findAll({
        where:
        {
            isDeleted: isDeleted
        }
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
                err.message || "Some error occurred while retrieving Bike Reviews."
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
        User.findOne({
            where:
            {
                EmaiID: useremail
            }
        }).then(data => {
            const uid = data.UserID;

            if (!req.body.Comment) {
                res.status(400).send({
                    message: "Content can not be empty!"
                });
                return;
            }

            const bikereview = {
                Comment: req.body.Comment,
                Likes: req.body.Likes,
                UserID: uid,
                BikeID: req.body.BikeID,
                UpdatedBy: uid
            };

            BikeReview.create(bikereview).then(data => {
                res.status(200).send(data);
            }).catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while adding bike review."
                });
            });
        });
    });
};

exports.findMostLikedBikes = (req, res) => {
    
    const sql = "SELECT * FROM reviewtbls WHERE isDeleted=0 AND Likes>=3 GROUP BY BikeID ORDER BY Likes DESC";
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