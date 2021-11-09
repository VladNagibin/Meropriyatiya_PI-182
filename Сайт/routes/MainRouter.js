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

router.get('/', enterMiddle, async (req, res) => {
    const { cookies } = req
    GrUsers = await GroupOfUsers.find({ "users.mail": cookies.UserMail.toString() }).lean()
    
    if ('UserName' in cookies) {
        res.render('index', {
            title: "main page",
            Username: cookies.UserName,
            OurGroup: GrUsers
        })
    }
    else {
        res.render('index', {
            title: "main page",
            Username: 'Not found',
            OurGroup: GrUsers
        })
    }



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

//группы пользователей



router.post('/addInGroup', group.addInGroup)

router.get('/createGroup', enterMiddle, group.createGroup)

router.post('/saveGroup', enterMiddle, group.saveGroup)

router.get('/redGroup', enterMiddle, group.redGroup)

router.post('/saveExistedGroup', enterMiddle, group.saveExistedGroup)

router.post('/openGroup',enterMiddle,(async (req,res)=>{
    const {idOfGroup} = req.body
    const { cookies } = req
    foundedGroup = await GroupOfUsers.findById(idOfGroup).lean()
    res.render('group',{
        title: 'Group page',
        OurGroup: foundedGroup.users,
        Username: cookies.UserName,
        nameGr: foundedGroup.name,
        location: foundedGroup.startLocation,
        id:foundedGroup._id,
        events:foundedGroup.events

    })
}))

// роли

router.get('/createRole', enterMiddle,((req, res)=>{
    const { cookies } = req
    res.render('create_role')
}))

router.post('/addEvent',enterMiddle,(async (req,res)=>{
    const {id,name,date,time,location}=req.body
    const {cookies}=req
    foundedGroup=await GroupOfUsers.findById(id)
    foundedGroup.events.push({
        location:location,
        name:name,
        date:date,
        time:time,
    })
    await foundedGroup.save()
    //res.body.idOfGroup=id;
    res.redirect('/')


}))
router.post('/sendEmail', enterMiddle,(req,res)=>{
  // console.log(req)
  const {mail} = req.body
  console.log(mail) 
  
  res.redirect('/') 
})
router.post('/createRole',enterMiddle,(async (req,res)=>{
    const {name,addGroup,addUsers,addRoles} = req.body
    if (addGroup == 'on'){
        var aGr=true
    }else{
        var aGr=false
    }
    if (addUsers == 'on'){
        var aUs=true
    }else{
        var aUs=false
    }
    if (addRoles == 'on'){
        var aRs=true
    }else{
        var aRs=false
    }
    const role = new Role({
        name : name,
        addGroups : aGr,
        addUsers : aUs,
        addRoles : aRs
    })
    await role.save()
    res.redirect('/')
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
