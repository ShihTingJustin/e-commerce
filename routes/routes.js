const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', (req, res) => res.render('login'))

router.get('/', (req, res) => res.render('index'))

module.exports = router