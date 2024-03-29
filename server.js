require('dotenv').config()

const express = require('express')
const methodOverride = require('method-override')
const path = require('path')
const hbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const moment = require('moment')
const ngrok = require('ngrok')
const { renderPage } = require('./helpers/renderPage')
const mongoose = require('mongoose')
const { selectOption } = require('./config/customFunctions')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const indexRoutes = require('./routes/indexRoutes')
const morgan = require('morgan')
const db = require('./config/db')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const passport = require('passport')
const { flashMessages } = require('./middlewares/flash')
const imageUploader = require('./helpers/imageUpload')
const fileUploader = require('./helpers/fileUpload')
const fs = require('fs')
const app = express()
const MongoStore = require('connect-mongo')(session)

//Setting Up Express
app.use(express())
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//Setting Up Session

//Setting Up Method Overrride
app.use(methodOverride('newMethod'))

//Setting Up Flash
app.use(flash())

/* Setup View Engine To Use Handlebars */
app.engine(
  'handlebars',
  hbs({
    defaultLayout: 'default',
    helpers: {
      select: selectOption,
      formatDate: function (creationDate) {
        return moment(creationDate).format('LL')
      }
    }
  })
)
app.set('view engine', 'handlebars')

//File Upload Middleware
app.use(fileUpload())

//Configure Environments
switch (app.get('env')) {
  case 'development':
    app.use(
      session({
        resave: true,
        secret: process.env.SESSION_KEY,
        saveUninitialized: false,
        store: new MongoStore({
          url: db.development.connectionString
        })
      })
    )

    mongoose
      .connect(db.development.connectionString, {
        useNewUrlParser: true,
        useCreateIndex: true
      })
      .then(response => {
        console.log('MongoDB Development connected succesfully')
      })
      .catch(err => {
        console.log('MongoDB connection failed')
      })

    app.use(morgan('dev'))
    break
  case 'production':
    app.use(
      session({
        resave: true,
        secret: process.env.SESSION_KEY,
        saveUninitialized: false,
        store: new MongoStore({
          url: db.production.connectionString
        })
      })
    )

    mongoose
      .connect(db.production.connectionString, {
        useNewUrlParser: true,
        useCreateIndex: true
      })
      .then(response => {
        console.log('MongoDB Production connected succesfully')
      })
      .catch(err => {
        console.log('MongoDB connection failed')
      })

    app.use(morgan('dev'))
    break
  default:
    throw new Error('Unknown environment')
}

//Setting up Passport
app.use(passport.initialize())
app.use(passport.session())
app.use(
  express.urlencoded({
    extended: false
  })
)

//Default Variables
app.use(flashMessages)

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

//API ROUTES
app.use('/', authRoutes, indexRoutes)
app.use('/dashboard', adminRoutes)

//LIsten To Server and Port Number
const port = process.env.PORT || 7000
app.listen(port, err => {
  console.log(`Node.js  server live on ${port}`)
})
