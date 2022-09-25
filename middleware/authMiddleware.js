const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.Authenticate = (req, res, next) => {
    const token = req.cookies.jwt
    if(!token) {
        return res.redirect('/login')
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, token) => {
        if(error) {            
            return res.redirect('/login')
        } else {
            next()
        }
    });    
}

exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (error, token) => {
            if(error) {    
                res.locals.user = null        
                next()
            } else {
                const userId = token.id
                const user = await User.findById(userId)
                res.locals.user = user
                next()
            }
        });
    } else {
        res.locals.user = null        
        next()
    }
}