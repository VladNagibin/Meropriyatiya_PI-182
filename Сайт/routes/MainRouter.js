const { Router, response } = require('express')
const router = Router()
const bCrypt = require('bcrypt')
const User = require('../models/User')
const GroupOfUsers = require('../models/GroupOfUsers')
const Cookies = require('cookies')
const enter = require('../modules/enter')
const enterMiddle = require('../middleware/enter')


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




router.post('/enter', enter.logIn)/*( async(req, res) => {
   var login=await User.findOne({mail:req.body.mail})
        if(login!=null){
            const isValid = bCrypt.compareSync(password,login.password)
            if (isValid){
                const token = jwt.sign(login.id.toString(),jwtSecret)
                
                cookies.set('enter',token,{signed:true})
            }
            console.log("Вход выполнен")
            res.redirect('/')
        }
        else{
            console.log("Вход не выполнен")
            res.redirect('/EnterInAccount')
        }


})*/
router.get('/registration', ((req, res) => {
    res.render('registration', {
        title: "registration page",
    })
}))
router.post('/registration', (async (req, res) => {

    var hashPassword = (await bCrypt.hash(req.body.password, 10))
    const user = new User({
        password: hashPassword,
        name: req.body.name,
        mail: req.body.mail
    })



    await user.save()

    console.log("Пользователь зарегистрирован: " + user.name)

    res.redirect('/')

}))
router.get('/out', ((req, res) => {
    res.clearCookie('UserHash')
    res.clearCookie('UserName')
    res.clearCookie('UserMail')
    res.clearCookie('addedMails')
    res.redirect('/EnterInAccount')
}))
router.post('/addInGroup', (req, res) => {
    const { mail, name } = req.body
    const { cookies } = req
    addedMails = JSON.parse(cookies.addedMails)
    addedMails.push(mail)
    res.cookie('addedMails', JSON.stringify(addedMails))
    res.render('create', {
        title: 'create page',
        Username: cookies.UserName,
        Mails: addedMails,
        name
    })
})
router.get('/createGroup', enterMiddle, ((req, res) => {
    const { cookies } = req
    var addedMails = []
    addedMails.push(cookies.UserMail.toString())
    res.cookie('addedMails', JSON.stringify(addedMails))
    res.render('create', {
        title: 'create page',
        Username: cookies.UserName,
        Mails: addedMails
    })
}))

router.post('/saveGroup', enterMiddle, (async (req, res) => {
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

}))

router.get('/redGroup', enterMiddle, ((req, res) => {
    const { cookies } = req
    addedMails = JSON.parse(cookies.addedMails)
    res.render('edit', {
        title: 'edit page',
        Username: cookies.UserName,
        Mails: addedMails
    })
}))
router.post('/openGroup',enterMiddle,(async (req,res)=>{
    const {idOfGroup} = req.body
    const { cookies } = req
    group = await GroupOfUsers.findById(idOfGroup).lean()
    res.render('group',{
        title: 'Group page',
        OurGroup: group.users,
        Username: cookies.UserName

    })
}))

router.post('/saveExistedGroup', enterMiddle, (async (req, res) => {
    const { name } = req.body
    const { cookies } = req
    let foundedMails = []
    addedMails = JSON.parse(cookies.addedMails)
    for (var i = 0; i < addedMails.length; i++) {
        user = await User.findOne({ mail : addedMails[i] })
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

}))

router.post('/sendEmail', enterMiddle,(req,res)=>{
  // console.log(req)
  const {mail} = req.body
  console.log(mail) 
  
  res.redirect('/') 
})

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
