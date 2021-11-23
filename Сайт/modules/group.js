const cookie = require('cookie-parser')
const mongoose = require('mongoose')
const User = require('../models/User')
const GroupOfUsers = require('../models/GroupOfUsers')
const addInGroup = (req, res) => {
    const { mail, name,location } = req.body
    const { cookies } = req
    addedMails = JSON.parse(cookies.addedMails)
    addedMails.push(mail)
    res.cookie('addedMails', JSON.stringify(addedMails))
    res.render('create', {
        title: 'create page',
        Username: cookies.UserName,
        Mails: addedMails,
        name,
        location
    })
}

const createGroup = ((req, res) => {
    const { cookies } = req
    var addedMails = []
    addedMails.push(cookies.UserMail.toString())
    res.cookie('addedMails', JSON.stringify(addedMails))
    res.render('create', {
        title: 'create page',
        Username: cookies.UserName,
        Mails: addedMails
    })
})

const saveGroup = (async (req, res) => {
    const { name } = req.body
    const { cookies } = req
    let foundedMails = []
    addedMails = JSON.parse(cookies.addedMails)
    for (var i = 0; i < addedMails.length; i++) {
        user = await User.findOne({ mail: addedMails[i] })
        if (!user) {
            console.log('user ' + addedMails[i].toString() + ' not found')
        }
        else {
            foundedMails.push({
                name: user.name,
                mail: user.mail
            })
        }

    }
    const newGroup = new GroupOfUsers({
        name: name,
        users: foundedMails
    })
    await newGroup.save()
    res.clearCookie('addedMails')
    res.redirect('/')

})

const redGroup=((req, res) => {
    const { cookies } = req
    addedMails = JSON.parse(cookies.addedMails)
    res.render('edit', {
        title: 'edit page',
        Username: cookies.UserName,
        Mails: addedMails
    })
})

const saveExistedGroup = (async (req, res) => {
    const { name } = req.body
    const { cookies } = req
    let foundedMails = []
    addedMails = JSON.parse(cookies.addedMails)
    for (var i = 0; i < addedMails.length; i++) {
        user = await User.findOne({ mail: addedMails[i] })
        if (!user) {
            console.log('user ' + addedMails[i].toString() + ' not found')
        }
        else {
            foundedMails.push({
                name: user.name,
                mail: user.mail
            })
        }

    }
    const Group = await GroupOfUsers.findOne({name:name}).lean()
    
    await newGroup.save()
    res.clearCookie('addedMails')
    res.redirect('/')

})

module.exports = {addInGroup, createGroup, saveGroup,redGroup, saveExistedGroup}