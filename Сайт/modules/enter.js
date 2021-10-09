const mongoose = require('mongoose')
const bCrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
var User = mongoose.model('user')
const {jwtSecret} = require('../config/app')
const logIn = (async (req, res) => {
    const { email, password } = req.body
    User.findOne({ mail : email })
        .exec()
        .then((user => {
            if (!user) {
                res.status(401).json({ message: 'User does not exist' })
            }

            const isValid = bCrypt.compareSync(password, user.password)
            if (isValid) {
                const token = jwt.sign(user._id.toString(),jwtSecret)
                res.cookie('UserHash',token.toString())
                res.cookie('UserName',user.name,toString())
                res.cookie('UserMail',user.mail,toString())
                res.redirect('/')
                //res.json({ token })
            }
            else {
                res.status(401).json({ message: 'invalid password' })
            }

        }))
    })

module.exports = { logIn }



