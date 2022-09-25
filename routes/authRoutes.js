'use strict'

const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

module.exports = router

router.route('/signup')
    .get(authController.signupGet)
    .post(authController.signupPost)

router.route('/login')
    .get(authController.loginGet)
    .post(authController.loginPost)

router.get('/logout', authController.logout)