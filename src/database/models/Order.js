const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const CartItem = sequelize.define('CartItem', {
  userId:    { type: DataTypes.BIGINT,  allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  quantity:  { type: DataTypes.INTEGER, defaultValue: 1 },
  // 'active' = savatda | 'ordered' = buyurtma berildi
  status:    { type: DataTypes.STRING,  defaultValue: 'active' },
});

const Order = sequelize.define('Order', {
  userId:     { type: DataTypes.BIGINT,        allowNull: false },
  phone:      { type: DataTypes.STRING,        allowNull: true },
  latitude:   { type: DataTypes.FLOAT,         allowNull: true },
  longitude:  { type: DataTypes.FLOAT,         allowNull: true },
  totalPrice: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  status:     { type: DataTypes.STRING,        defaultValue: 'pending' },
});

module.exports = { CartItem, Order };