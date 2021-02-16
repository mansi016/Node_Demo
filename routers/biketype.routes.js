module.exports = app => {
    const biketypes = require("../controllers/biketype.controller.js");

    var router = require("express").Router();
    router.post("/addBikeType", biketypes.create);
    router.get("/", biketypes.findAll);
    app.use('/biketypes', router);
};