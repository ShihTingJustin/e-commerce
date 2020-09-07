'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CartItems',
      Array.from({ length: 20 }).map((item, index) =>
        ({
          CartId: Math.floor(Math.random() * 3) + 1,
          ProductId: Math.floor(Math.random() * 10) + 1,
          quantity: Math.floor(Math.random() * 5) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CartItems', null, {})
  }
};
