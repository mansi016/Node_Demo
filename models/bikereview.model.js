
const DataTypes = require("sequelize");
const db = require("../config/db");
const bike = require("./bike.model");
const user = require("./user.model");

const BikeReview = db.sequelize.define("reviewtbl", {
    ReviewID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Comment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        max: 5
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    BikeID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }
});

//relationship
BikeReview.belongsTo(user, {
    foreignKey: "UserID",
    onDelete: "cascade",
    as: "userid"
});

BikeReview.belongsTo(bike, {
    foreignKey: "BikeID",
    onDelete: "cascade",
    as: "bikeid"
});

BikeReview.belongsTo(user, {
    foreignKey: "UpdatedBy",
    onDelete: "cascade",
    as: "updateUser"
});

module.exports = BikeReview;