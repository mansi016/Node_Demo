
const DataTypes = require("sequelize");
const db = require("../config/db");
const biketype = require("./biketype.model");
const user = require("./user.model");

const Bike = db.sequelize.define("bikestbl", {
    BikeID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    BikeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    BikeTypeID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    BikePrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }
});

//relationship
Bike.belongsTo(biketype, {
    foreignKey: "BikeTypeID",
    onDelete: "cascade",
    as: "biketype"
});

Bike.belongsTo(user, {
    foreignKey: "CreatedBy",
    onDelete: "cascade",
    as: "createUser"
});

Bike.belongsTo(user, {
    foreignKey: "UpdatedBy",
    onDelete: "cascade",
    as: "updateUser"
});

module.exports = Bike;