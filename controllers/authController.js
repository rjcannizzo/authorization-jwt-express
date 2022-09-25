'use strict'
const User = require('../models/User')

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
    return errors
}

exports.loginGet = (req, res) => {
    res.render('login')
}

exports.loginPost = async (req, res) => {
    const { email, password } = req.body
    
    res.send({message: 'OK'})
}

exports.signupGet = (req, res) => {
    res.render('signup')
}

exports.signupPost = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.create({email, password})
        res.status(201).json(user)
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }   
}

exports.logout = (req, res) => {
    res.send({message: 'OK'})
}

