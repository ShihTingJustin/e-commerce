const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, CartItem, Cart } = db

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({
      where: { email }
    }).then(user => {
      if (!user) return done(null, false, req.flash('error_msg', '此 Email 尚未註冊。'))
      if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_msg', 'Email 或密碼填寫錯誤。'))
      return user
    }).then(user => {
      const sessionCartId = req.session.cartId
      if (sessionCartId) {
        // Is cart have UserId ?
        Cart.findOne({
          where: { UserId: user.dataValues.id }
        }).then(cart => {
          // Yes then update cartItem
          if (cart) {
            CartItem.findAll({
              where: { CartId: sessionCartId }
            }).then(cartItems => {
              cartItems.forEach(cartItem => { cartItem.update({ CartId: cart.id }) })
            })
          } else {
            // No, so update cart UserId and cartItem
            Cart.findByPk(sessionCartId).then(cart => {
              // update cart UserId
              cart.update({ UserId: user.dataValues.id })
              // update new cartId if necessary
              CartItem.findAll({
                where: { CartId: sessionCartId }
              }).then(cartItems => {
                cartItems.forEach(cartItem => { cartItem.update({ CartId: cart.id }) })
              })
            })
          }
        })
      } else {
        Cart.findOrCreate({
          where: { UserId: user.dataValues.id },
          default: { UserId: user.dataValues.id }
        })
      }
      return user
    }).then(user => {
      return done(null, user)
    }).then(err => console.log(err))
  }
))

passport.use(new FacebookStrategy(
  {
    passReqToCallback: true,
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (req, accessToken, refreshToken, profile, done) => {
    const { email, name, profile_pic } = profile._json
    User.findOne({ where: { email } })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        return User.create({
          name,
          email,
          password: bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10), null),
          role: 'user'
        }).then(user => {
          const sessionCartId = req.session.cartId
          if (sessionCartId) {
            // Is cart have UserId ?
            Cart.findOne({
              where: { UserId: user.dataValues.id }
            }).then(cart => {
              // Yes then update cartItem
              if (cart) {
                CartItem.findAll({
                  where: { CartId: sessionCartId }
                }).then(cartItems => {
                  cartItems.forEach(cartItem => { cartItem.update({ CartId: cart.id }) })
                })
              } else {
                // No, so update cart UserId and cartItem
                Cart.findByPk(sessionCartId).then(cart => {
                  // update cart UserId
                  cart.update({ UserId: user.dataValues.id })
                  // update new cartId if necessary
                  CartItem.findAll({
                    where: { CartId: sessionCartId }
                  }).then(cartItems => {
                    cartItems.forEach(cartItem => { cartItem.update({ CartId: cart.id }) })
                  })
                })
              }
            })
          } else {
            Cart.findOrCreate({
              where: { UserId: user.dataValues.id },
              default: { UserId: user.dataValues.id }
            })
          }
          return user
        }).then(user => done(null, user, req.flash('success_msg', '登入成功。')))
          .catch(err => done(err, false))
      })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((req, id, done) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
})

module.exports = passport