const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../models')
const User = db.User

const userController = {

  registerPage: (req, res) => {
    return res.render('register')
  },

  register: (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = []

    if (!email && !password && !confirmPassword) {
      errors.push({ message: '請填寫下列欄位。' })
    } else if (!name) {
      errors.push({ message: '請填寫名稱。' })
    } else if (!email) {
      errors.push({ message: '請填寫 Email。' })
    } else if (!password) {
      errors.push({ message: '請填寫密碼。' })
    } else if (!confirmPassword) {
      errors.push({ message: '請填寫確認密碼。' })
    }

    if ((password.length && confirmPassword.length) && (password !== confirmPassword)) {
      errors.push({ message: '密碼或確認密碼填寫錯誤。' })
    }

    if (errors.length) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          errors.push({ message: '此 Email 已經被註冊。' })
          return res.render('register', {
            name,
            email,
            password,
            confirmPassword
          })
        }
        return User.create({
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          role: 'user'
        }).then(user => {
          req.flash('success_msg', '註冊成功。')
          return res.redirect('/register')
        })
          .catch(err => console.log(err))
      })
  },

  loginPage: (req, res) => {
    if (req.isAuthenticated()) res.redirect('/')
    else res.render('login')
  },

  login: (req, res) => {
    req.flash('success_msg', "登入成功。")
    res.redirect('/')
  },

  logout: (req, res) => {
    req.flash('success_msg', '登出成功。')
    req.logout()
    res.redirect('/')
  }

}

module.exports = userController