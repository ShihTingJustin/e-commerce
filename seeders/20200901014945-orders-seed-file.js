'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Orders',
      Array.from({ length: 2 }).map((item, index) => ({
        name: faker.commerce.productName(),
        phone: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        amount: faker.random.number(),
        sn: faker.random.number(),
        shipping_status: Math.floor(Math.random() * 1),
        payment_status: Math.floor(Math.random() * 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Orders', null, {})
  }
};
