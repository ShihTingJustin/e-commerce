const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const testController = require('../controllers/testController')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  req.session.redirectTo = req.originalUrl
  res.redirect('/login')
}

const authenticatedTester = (req, res, next) => {
  if (req.user.role === 'test') return next()
  req.session.redirectTo = req.originalUrl
  res.redirect('/login')
}

router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)
router.get('/productsRedis', productController.getProductsRedis)
router.get('/cart', authenticated, cartController.getCart)
router.post('/cart', cartController.postCart)
router.patch('/cart_item/:id', authenticated, cartController.patchCartItem)
router.delete('/cart_item/:id', authenticated, cartController.deleteCartItem)

// order and payment
router.get('/orders', authenticated, orderController.getOrders)
router.post('/orders', authenticated, orderController.postOrder)
router.post('/orders/:id/cancel', authenticated, orderController.cancelOrder)
router.get('/orders/:id/payment', authenticated, orderController.getPayment)
router.post('/newebpay/callback', authenticated, orderController.newebpayCallback)

// load testing
router.get('/test_get_order', authenticatedTester, testController.testGetOrder)
router.get('/test_get_SN', authenticatedTester, testController.testGetSN)
router.post('/test_pay', authenticatedTester, testController.testPay)
router.get('/test_report', authenticatedTester, testController.getReport)

// login
router.get('/users', userController.registerPage)
router.post('/users', userController.register)
router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), userController.login)
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
