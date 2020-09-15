'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // one admin
    queryInterface.bulkInsert('Users', [{
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // modify seed data arguments here
    const userCounts = 3        // 3 users

    queryInterface.bulkInsert('Users',
      Array.from({ length: userCounts }, (_, i) =>
        ({
          name: faker.name.findName(),
          account: `user${i}`,
          email: `user${i}@example.com`,
          password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
