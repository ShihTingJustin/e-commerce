require('dotenv').config()
module.exports = {
  "development": {
    "username": "root",
    "password": "password",
    "database": "ecommerce",
    "host": "127.0.0.1",
    "dialect": "mysql",
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.AWS_USERNAME,
    "password": process.env.AWS_PW,
    "database": process.env.AWS_DB,
    "host": process.env.AWS_HOST,
    "dialect": "mysql"
  }
}