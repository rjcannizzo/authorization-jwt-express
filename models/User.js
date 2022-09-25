'use strict'
const mongoose = require('mongoose')
const {isEmail}  = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [4, 'Password must be at least 4 characters']
    }
})

userSchema.pre('save', async function(next) {    
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

/**
 * Checks user email and password for login route.
 * @param {string} email 
 * @param {string} password 
 * @returns User object
 */
userSchema.statics.login = async function(email, password) {
    try {
        const user = await this.findOne({email})
        if(!user) {
            throw Error('Incorrect email')
        }
        const passwordIsValid = await bcrypt.compare(password, user.password)
        if(passwordIsValid) {
            return user
        }
        throw Error('Incorrect password')

    } catch (error) {
        throw error
    }   
}

const User = mongoose.model('user', userSchema)

module.exports = User