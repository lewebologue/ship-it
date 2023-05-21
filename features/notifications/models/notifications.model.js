const DataTypes = require('sequelize');
const db = require('@config/db.config.js');

const Notification = db.define('notification', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content : {
        type: DataTypes.STRING,
        allowNull: false
    },
    publish: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
},{
    freezeTableName: true,
});

module.exports = Notification;