// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true // Bisa null jika tidak login via Google
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    profilePic: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true // createdat dan updatedat otomatis
});

module.exports = User;