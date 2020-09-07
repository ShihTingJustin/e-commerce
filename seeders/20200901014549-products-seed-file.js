'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products',
      Array.from({ length: 10 }).map((item, index) =>
        ({
          id: index + 1,
          name: faker.commerce.productName(),
          description: faker.commerce.product() + '/' + faker.commerce.productName(),
          price: faker.commerce.price(),
          image: faker.image.imageUrl(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {})
  }
};
