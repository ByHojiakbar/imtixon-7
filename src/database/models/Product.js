const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  // 'ichimliklar' | 'sabzavotlar' | 'shirinliklar'
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl:    { type: DataTypes.STRING, allowNull: true },
  composition: { type: DataTypes.TEXT,   allowNull: true },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Product;