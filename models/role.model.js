const DataTypes = require("sequelize");
const db = require("../config/db");

const Role = db.sequelize.define('roletbl', {
    RoleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    RoleName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


module.exports = Role;