const jwt = require('jsonwebtoken')

const Authenticate = (req, res, next) => {
    const token = req.cookies.jwt
    if(!token) {
        return res.redirect('/login')
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, token) => {
        if(error) {
            console.log(error.message)
            return res.redirect('/login')
        } else {
            next()
        }
    })    
}

module.exports = Authenticate