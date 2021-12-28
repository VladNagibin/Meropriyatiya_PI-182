const {model, Schema}=require('mongoose')
const schema = new Schema({
    name:{
        type: String,
        required:true
    }, 
    mail:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    roleId:{
        type:String,
        required:true
    },
    pic_url:{
        type:String,
    },
    groups:{
        type:Array
    },
    invites:{
        type:Array
    }
    
       
})
module.exports = model('user', schema)