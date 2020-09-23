'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    stock: DataTypes.INTEGER
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsToMany(models.Cart, {
      as: 'carts',
      through: {
        model: models.CartItem, unique: false
      },
      foreignKey: 'ProductId'
    })
    Product.belongsToMany(models.Order, {
      as: 'orders',
      through: {
        model: models.OrderItem, unique: false
      },
      foreignKey: 'ProductId'
    })
  };
  return Product;
};