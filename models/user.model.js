
const DataTypes = require("sequelize");
const db = require("../config/db");
const roles = require("./role.model");

const User = db.sequelize.define("userstbl", {
    UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "unique_tag"
    },
    Password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    EmaiID: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: true,
        unique: "unique_tag"
    },
    RoleID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DOB: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ContactNo: {
        type: DataTypes.STRING,
        allowNull: false,
        is: /^[6-9][0-9]{9}$/
    },
    Address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }
},
    {
        unique_tag: [
            {
                customIndex: true,
                fields: ['Username', 'EmaiID']
            }
        ]
    }
);

//relationship
User.belongsTo(roles, {
    foreignKey: "RoleID",
    onDelete: "cascade",
    as: "roles"
});

module.exports = User;