'use strict';

const faker = require('faker')
require('dotenv').config()

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Products',
      Array.from({ length: 10 }).map((_, i) =>
        ({
          id: i + 1,
          name: `iPhone ${i}`,
          description: faker.commerce.product() + '/' + faker.commerce.productName(),
          price: Math.floor(Math.random() * i * 5000) + 1,
          image: `https://loremflickr.com/640/480/fruit/?lock=${i}`,
          stock: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {})

    queryInterface.bulkInsert('Products',
      Array.from({ length: 10 }).map((_, i) =>
        ({
          id: i + 11,
          name: `iPad ${i}`,
          description: faker.commerce.product() + '/' + faker.commerce.productName(),
          price: Math.floor(Math.random() * i * 4000) + 1,
          image: `https://loremflickr.com/640/480/fruit/?lock=${i + 10}`,
          stock: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {})

    return queryInterface.bulkInsert('Products',
      Array.from({ length: 10 }).map((_, i) =>
        ({
          id: i + 21,
          name: `Mac ${i}`,
          description: faker.commerce.product() + '/' + faker.commerce.productName(),
          price: Math.floor(Math.random() * i * 7000) + 1,
          image: `https://loremflickr.com/640/480/fruit/?lock=${i + 20}`,
          stock: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {})
  }
};
