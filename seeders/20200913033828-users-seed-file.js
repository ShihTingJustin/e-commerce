'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    // normal test account
    const userCounts = 3        // users quantity
    queryInterface.bulkInsert('Users',
      Array.from({ length: userCounts }, (_, i) =>
        ({
          name: faker.name.findName(),
          email: `user${i}@example.com`,
          password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})

    // load testing user
    const testUserCounts = 150
    return queryInterface.bulkInsert('Users',
      Array.from({ length: testUserCounts }, (_, i) =>
        ({
          name: faker.name.findName(),
          email: `lt-user${i}@example.com`,
          password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
          role: 'test',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
