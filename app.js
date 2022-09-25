'use strict'

const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
require('dotenv').config()
const authRouter = require('./routes/authRoutes')
const cookieParser = require ('cookie-parser')
const Authenticate = require('./middleware/authMiddleware')

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {})
  .catch((err) => console.log(err));

// routes
app.get('/', Authenticate, (req, res) => res.render('home'));
app.get('/smoothies', Authenticate, (req, res) => res.render('smoothies'));
app.use(authRouter)




app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})

