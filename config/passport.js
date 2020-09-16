const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_msg', '此 Email 尚未註冊。'))
        if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_msg', 'Email 或密碼填寫錯誤。'))
        return done(null, user)
      })
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
        })
          .then(user => done(null, user, req.flash('success_msg', '登入成功。')))
          .catch(err => done(err, false))
      })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
})

module.exports = passport