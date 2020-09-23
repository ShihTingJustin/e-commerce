'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Products',
      Array.from({ length: 10 }).map((_, i) =>
        ({
          id: i + 1,
          name: `iPhone ${i}`,
          description: faker.commerce.product() + '/' + faker.commerce.productName(),
          price: Math.floor(Math.random() * i * 5000) + 1,
          image: `https://source.unsplash.com/640x480/?apple,iphone${i}`,
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
          image: `https://source.unsplash.com/640x480/?apple,ipad${i}`,
          stock: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {})

    return queryInterface.bulkInsert('Products',
      Array.from({ length: 10 }).map((_, i) =>
        ({
          id: i + 21,
          name: `MacBook Pro ${i}`,
          description: faker.commerce.product() + '/' + faker.commerce.productName(),
          price: Math.floor(Math.random() * i * 7000) + 1,
          image: `https://source.unsplash.com/640x480/?apple,macbookpro${i}`,
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
