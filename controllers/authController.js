'use strict'
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const maxAge = 60 * 60 * 24 // JWT expiration in seconds

/**
 * Returns an object with email and password error messages
 * @param {*} err Error object
 * @returns Object
 */
function handleErrors(err) {
    let errors = {email: '', password: ''}    
   
    if(err.message.includes('user validation failed')) {
        errors.email    = err.errors.email ? err.errors.email.message : ''
        errors.password = err.errors.password ? err.errors.password.message : ''        
    }
    if(err.code === 11000) {
        errors.email = 'That email is already registered'
    }

    if(err.message === 'Incorrect email') {
        errors.email = 'That email is not registered'
    }
    if(err.message === 'Incorrect password') {
        errors.password = 'Password is incorrect'
    }

    return errors
}

/**
 * Returns a JSON Web token
 * @param {number} userID 
 * @returns json web token
 */
const createToken = (userID) => {
    return jwt.sign({id: userID}, process.env.JWT_SECRET, {expiresIn: maxAge})
}

exports.loginGet = (req, res) => {
    res.render('login')
}

exports.loginPost = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user.id)        
        res.cookie('jwt', token, {httpOnly: true, expiresIn: maxAge * 1000}) // expiresIn requires milliseconds
        res.json({user: user.id})    
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }    
}

exports.signupGet = (req, res) => {
    res.render('signup')
}

exports.signupPost = async (req, res) => {       
    try {
        const { email, password } = req.body 
        const user = await User.create({email, password})
        const token = createToken(user.id)        
        res.cookie('jwt', token, {httpOnly: true, expiresIn: maxAge * 1000}) // expiresIn requires milliseconds
        res.status(201).json({user: user.id})
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }   
}

exports.logout = (req, res) => {
    // replace the user's jwt cookie with empty token and maxAge set to 1 millisecond
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/login')
}

