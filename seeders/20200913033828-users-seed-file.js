'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    // one admin
    queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // modify seed data arguments here
    const userCounts = 150        // users quantity

    return queryInterface.bulkInsert('Users',
      Array.from({ length: userCounts }, (_, i) =>
        ({
          name: faker.name.findName(),
          email: `user${i}@example.com`,
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
