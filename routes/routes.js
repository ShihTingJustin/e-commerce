const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')

router.get('/products', productController.getProducts)
router.get('/cart', cartController.getCart)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}),userController.login)
router.get('/logout', userController.logout)

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

router.get('/', (req, res) => res.render('index'))


module.exports = router