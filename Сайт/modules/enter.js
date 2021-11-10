const mongoose = require('mongoose')
const bCrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
var User = mongoose.model('user')
const Role = require('../models/Role')
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
                res.cookie('RoleId', user.roleId)
                //res.cookie('UserRole',user.roleId,toString())
                res.redirect('/')
                //res.json({ token })
            }
            else {
                res.status(401).json({ message: 'invalid password' })
            }

        }))
    })
const registration = (async (req, res) => {

    var hashPassword = (await bCrypt.hash(req.body.password, 10))
    userRole = await Role.findOne({name : req.body.role})
    const user = new User({
        password: hashPassword,
        name: req.body.name,
        mail: req.body.mail,
        roleId : userRole._id
    })



    await user.save()

    console.log("Пользователь зарегистрирован: " + user.name)

    res.redirect('/')

})
const out = ((req, res) => {
    res.clearCookie('UserHash')
    res.clearCookie('UserName')
    res.clearCookie('UserMail')
    res.clearCookie('addedMails')
    res.clearCookie('RoleId')
    res.redirect('/EnterInAccount')
})


module.exports = { logIn,registration,out }



