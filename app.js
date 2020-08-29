const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

app.engine('hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.get('/', (req, res) => res.render('index'))
app.get('/login', (req, res) => res.render('login'))
app.get('/register', (req, res) => res.render('register'))

app.listen(PORT, () => console.log(`App is running on http://localhost:${PORT}`))