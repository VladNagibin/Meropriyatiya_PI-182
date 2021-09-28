const { Router, response } = require('express')
const router = Router()
const bCrypt = require('bcrypt')
const User = require('../models/User')
const GroupOfUsers = require('../models/GroupOfUsers')
const Cookies = require('cookies')
const enter = require('../modules/enter')
const enterMiddle = require('../middleware/enter')


router.get('/',enterMiddle, async (req, res) => {
    const {cookies } = req
    GrUsers= GroupOfUsers.findOne({
        'users':{'mail': cookies.UserMail }
    })
    if ('UserName' in cookies){
        res.render('index',{
            title:"main page",
            Username: cookies.UserName,
            GrUsers
        })
    }
    else{
        res.render('index',{
            title:"main page",
            Username:'Not found'
        })
    }
    
})
router.get('/EnterInAccount', ((req, res) => {
    res.render('Enter',{
        title:"Enter page",
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
    res.render('registration',{
        title:"registration page",
    })
}))
router.post('/registration', (async (req, res) => {
   
    var hashPassword=(await bCrypt.hash(req.body.password.toString(), 10)).toString()
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
    res.redirect('/EnterInAccount')
}))
router.post('/addInGroup',(req,res)=>{
    const {mail,addedMails} = req.body
    addedMails.push(mail)
    res.addedMails
    res.redirect('createGroupWith') 
 })
router.get('/createGroup',enterMiddle,((req,res)=>{
    const {cookies} = req
    let addedMails = []
    addedMails.push(cookies.UserMail.toString())
    
    res.render('create',{
        title: 'create page',
        Username: cookies.UserName,
        addedMails
    })
}))
router.get('/createGroupWith',enterMiddle,((req,res)=>{
    const {cookies,addedMails} = req
    res.render('create',{
        title: 'create page',
        Username: cookies.UserName,
        addedMails
    })
}))
module.exports = router