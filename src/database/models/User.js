const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const User = sequelize.define('User', {
  telegramId: {
    type: DataTypes.BIGINT,
    unique: true,
    allowNull: false,
  },
  firstName: { type: DataTypes.STRING, allowNull: true },
  lastName:  { type: DataTypes.STRING, allowNull: true },
  username:  { type: DataTypes.STRING, allowNull: true },
  phone:     { type: DataTypes.STRING, allowNull: true },
  isRegistered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;