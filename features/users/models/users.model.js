const DataTypes = require('sequelize');
const db = require('@config/db.config.js');
const roles = require('@utils/roles.enum.js');

const User = db.define('User', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    adress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'customer',
        validator: {
            isIn: [roles]
        }
    },
    banned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    freezeTableName: true,
});

module.exports = User;
