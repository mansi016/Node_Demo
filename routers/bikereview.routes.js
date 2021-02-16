module.exports = app => {
    const bikereview = require("../controllers/bikereview.controller.js");

    var router = require("express").Router();
    router.post("/addBikeReview", bikereview.create);
    router.get("/", bikereview.findAll);
    router.get("/MostLiked", bikereview.findMostLikedBikes);
    app.use('/BikeReviews', router);
};