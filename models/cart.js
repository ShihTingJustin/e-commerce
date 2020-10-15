'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    UserId: DataTypes.INTEGER
  }, {});
  Cart.associate = function (models) {
    // associations can be defined here
    Cart.belongsToMany(models.Product, {
      as: 'items',
      through: {
        model: models.CartItem, unique: false
      },
      foreignKey: 'CartId'
    })
  };
  return Cart;
};