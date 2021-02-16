const db=require("../config/db");

const bike=require("../models/bike.model");
const bikereview=require("../models/bikereview.model");
const biketype=require("../models/biketype.model");
const role=require("../models/role.model");
const user=require("../models/user.model");

db.sequelize.sync({ alter: true }).then(() => {
    console.log("DB Droped, Resync and roles created.");
});

module.exports={
    Bike: bike,
    BikeReview: bikereview,
    BikeType: biketype,
    Role: role,
    User: user,
}