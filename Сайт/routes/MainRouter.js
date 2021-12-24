const { Router, response } = require('express')
const router = Router()
const bCrypt = require('bcrypt')
const User = require('../models/User')
const Role = require('../models/Role')
const GroupOfUsers = require('../models/GroupOfUsers')
const Cookies = require('cookies')
const enter = require('../modules/enter')
const enterMiddle = require('../middleware/enter')
const group = require('../modules/group')
const session = require('express-session')
var ObjectId = require('mongodb').ObjectId

//{"_id" : {"$in" : [ObjectId("616484529ee3826c60782c1f"), ObjectId("6173e63790f4ba59bcd52459")]}}
router.get('/', enterMiddle, async (req, res) => {
    const { cookies } = req
    user = await User.findById(cookies.UserId.toString()).lean()
    let idGr=[]
    for(var i =0;i<user.groups.length;i++){
        idGr.push(ObjectId(user.groups[i].id))
    }

    GrUsers = await GroupOfUsers.find({"_id" : {"$in" : idGr}}).lean()
    
    var addGroups = false;
    var addUsers = false;
    var addRoles = false;
    if ('RoleId' in cookies) {
        role = await Role.findById(cookies.RoleId)
        addGroups = role.addGroups
        addUsers = role.addUsers
        addRoles = role.addRoles
    }
    var username
    if ('UserName' in cookies) {
        username = cookies.UserName
    }
    else {
        username = 'not found'
    }
    res.status(200).json({
        title: "main page",
        Username: username,
        OurGroup: GrUsers,
        addGroups: addGroups,
        addUsers: addUsers,
        addRoles: addRoles,
        invites: user.invites
    })


})
router.get('/EnterInAccount', ((req, res) => {
    res.render('Enter', {
        title: "Enter page",
    })
}))
router.get('/out', enter.out)
router.post('/registration', enter.registration)
router.post('/enter', enter.logIn)
router.get('/registration', ((req, res) => {
    res.render('registration', {
        title: "registration page",
    })
}))
router.post("/acceptInvite", (async (req, res) => {
    const { id } = req.query
    const { cookies } = req
    fGroup = await GroupOfUsers.findOne({ "_id": ObjectId(id) });
    //fGroup.name = fGroup.name + "asd";
    for (var i = 0; i < fGroup.users.length; i++) {
        if (fGroup.users[i].mail == cookies.UserMail) {
            var mail = fGroup.users[i].mail
            var name = fGroup.users[i].name
            fGroup.users.splice(i, 1)
            fGroup.users.push({
                name: name,
                mail: mail,
                accepted: true
            })


        }
    }

    await fGroup.save()
    user = await User.findOne({ "mail": cookies.UserMail.toString() })
    user.groups.push({
        id:id,
        name:fGroup.name
    })
    //await user.save()
    for (var i = 0; i < user.invites.length; i++) {
        if (user.invites[i].id == id) {
            user.invites.splice(i, 1)
        }
    }

    await user.save()
    res.status(200).json({message:'success'})
}))
router.post("/cancelInvite", (async (req, res) => {
    const { id, name } = req.query
    const { cookies } = req
    user = await User.findOne({ "mail": cookies.UserMail.toString() })
    for (var i = 0; i < user.invites.length; i++) {
        if (user.invites[i].id == id) {
            user.invites.splice(i, 1)
        }
    }
    await user.save()
    fgroup = await GroupOfUsers.findById(id)
    for (var i = 0; i < fgroup.users.length; i++) {
        if (fgroup.users[i].mail == user.mail) {
            fgroup.users.splice(i, 1)
        }
    }
    await fgroup.save()
    
    res.status(200).json({message:'success'})
}))

//группы пользователей



router.post('/addInGroup', enterMiddle, group.addInGroup)

router.get('/createGroup', enterMiddle, group.createGroup)

router.post('/saveGroup', enterMiddle, group.saveGroup)

router.get('/redGroup', enterMiddle, group.redGroup)

router.post('/saveExistedGroup', enterMiddle, group.saveExistedGroup)


router.get('/openGroup', enterMiddle, (async (req, res) => {
    const { id } = req.query
    const { cookies } = req
    foundedGroup = await GroupOfUsers.findById(id).lean()
    res.status(200).json({
        title: 'Group page',
        OurGroup: foundedGroup.users,
        Username: cookies.UserName,
        nameGr: foundedGroup.name,
        location: foundedGroup.startLocation,
        id,
        events: foundedGroup.events

    })
}))
router.post('/delete_event_from_group', enterMiddle, (async (req, res) => {
    const { id, name } = req.query
    foundedGroup = await GroupOfUsers.findById(id)
    for (var i = 0; i < foundedGroup.events.length; i++) {
        if (foundedGroup.events[i].name == name) {
            foundedGroup.events.splice(i, 1)
        }
    }
    await foundedGroup.save()
    res.status(200).json({
        message:'success',
        id:id.toString()                        
    })
    //res.redirect('/openGroup?id=' + id.toString())
}))
router.post('/delete_user_from_group', enterMiddle, (async (req, res) => {
    const { id, mail } = req.body
    foundedGroup = await GroupOfUsers.findById(id)
    for (var i = 0; i < foundedGroup.users.length; i++) {
        if (foundedGroup.users[i].mail == mail) {
            foundedGroup.users.splice(i, 1)
        }
    }
    await foundedGroup.save()
    res.status(200).json({
        message:'success',
        id:id.toString()                        
    })
    //res.redirect('/openGroup?id=' + id.toString())
}))
router.post('/deleteGroup', enterMiddle, (async (req, res) => {
    const { id } = req.query
    await GroupOfUsers.deleteOne({ _id: id })
    res.status(200).json({message:'success'})
}))

// роли

router.get('/createRole', enterMiddle, ((req, res) => {
    const { cookies } = req
    res.render('create_role', {
        Username: cookies.UserName,
    })
}))
router.post('/openEventAdd', enterMiddle, (async (req, res) => {
    const { id } = req.body
    const { cookies } = req
    res.render('create_event', {
        id: id,
        Username: cookies.UserName
    })

}))
router.post('/addEvent', enterMiddle, (async (req, res) => {
    const { id, name, date, time, location } = req.body
    //const { cookies } = req
    foundedGroup = await GroupOfUsers.findById(id)
    foundedGroup.events.push({
        location: location,
        name: name,
        date: Date(date),
        time: Date(time),
    })
    await foundedGroup.save()
    //var idOfGroup = {idOfGroup : id}
    //req.session.group_id = id
    //res.body.idOfGroup=id;
    //res.send(idJson)
    res.status(200).json({
        message:'success',
        id:id.toString()                        
    })
   // res.redirect('/openGroup?id=' + id.toString())


}))
router.post('/sendEmail', enterMiddle, (req, res) => {
    // console.log(req)
    const { mail } = req.body
    console.log(mail)

    res.status(200).json({message:'success'})
})
router.post('/createRole', enterMiddle, (async (req, res) => {
    const { name, addGroup, addUsers, addRoles } = req.body
    if (addGroup == 'on') {
        var aGr = true
    } else {
        var aGr = false
    }
    if (addUsers == 'on') {
        var aUs = true
    } else {
        var aUs = false
    }
    if (addRoles == 'on') {
        var aRs = true
    } else {
        var aRs = false
    }
    const role = new Role({
        name: name,
        addGroups: aGr,
        addUsers: aUs,
        addRoles: aRs
    })
    await role.save()
    res.status(200).json({message:'success'})
}))

/*$(function () {
    var send_mail = function () {
        var data = {
            'from': 'from@example.com',
            'to': ['subscriber@example.com'],
            'subject': 'Hello world!',
            'html_body': '<html><body>Hello dear user.</body></html>'
        };
        $.ajax({
            url: 'http://api.mailhandler.ru/message/send/',
            headers: {
                'X-Secure-Token': '<YOUR API KEY>',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (response) {
                console.log(response);
            }
        });
    };
});*/
module.exports = router
