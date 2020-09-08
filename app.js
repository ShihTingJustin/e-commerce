const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const app = express()
const PORT = 3000



if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')


// redis
const db = require('./models')
const Product = db.Product
const redis = require("redis");
const client = redis.createClient();
client.on('connect', () => console.log('Redis client connected'))
client.on('error', err => console.log('Something went wrong ' + err))

client.set("key", "value", redis.print);
client.get("key", redis.print);

app.use((req, res, next) => {
  Product.findAll({ raw: true, nest: true })
    .then(products => {
      products.forEach(product => {        
        client.hmset(product.id, product)
        client.hgetall(product.id, (err, object) => console.log(object))
      })
    })
    next()
})



app.engine('hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'ec',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000  //ms
  }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.user = req.user
  next()
})

require('./routes')(app)

app.listen(PORT, () => console.log(`App is running on http://localhost:${PORT}`))