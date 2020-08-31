const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/userController')

router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}),userController.login)

router.get('/', (req, res) => res.render('index'))

module.exports = router