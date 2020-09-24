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

router.get('/products', productController.getProducts)
// router.get('/productsR', productController.getProductsR)
router.get('/cart', authenticated, cartController.getCart)
router.post('/cart', cartController.postCart)
router.post('/cartItem/:id/add', authenticated, cartController.addCartItem)
router.post('/cartItem/:id/sub', authenticated, cartController.subCartItem)
router.delete('/cartItem/:id', authenticated, cartController.deleteCartItem)
// order
router.get('/orders', authenticated, orderController.getOrders)
router.post('/order', authenticated, orderController.postOrder)
router.post('/order/:id/cancel', authenticated, orderController.cancelOrder)
router.get('/order/:id/payment', authenticated, orderController.getPayment)
router.post('/newebpay/callback', authenticated, orderController.newebpayCallback)
router.post('/testpay', authenticated, testController.testPay)
router.get('/testGetOrder', authenticated, testController.testGetOrder)
router.get('/testGetSN', authenticated, testController.testGetSN)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)
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
