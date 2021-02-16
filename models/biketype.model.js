
const DataTypes = require("sequelize");
const db = require("../config/db");
const user = require("./user.model");

const BikeType = db.sequelize.define("biketypetbl", {
    BikeTypeID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    BikeType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CreatedBy: {
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
BikeType.belongsTo(user, {
    foreignKey: "CreatedBy",
    onDelete: "cascade",
    as: "createUser"
});

BikeType.belongsTo(user,{
    foreignKey: "UpdatedBy",
    onDelete: "cascade",
    as:"updateUser"
});

module.exports = BikeType;