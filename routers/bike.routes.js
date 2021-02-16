module.exports = app => {
    const bike = require("../controllers/bike.controller.js");

    var router = require("express").Router();
    router.post("/addBike", bike.create);
    router.get("/", bike.findAll);
    router.get("/RecentlyRegistered", bike.findRecentRegBikes);
    router.get("/:id", bike.findByID);
    router.get("/BikeTypes/:id", bike.findByBikeType);
    router.put("/updateBike/:id", bike.update);
    router.delete("/deleteBike/:id", bike.delete);
    app.use('/bikes', router);
};