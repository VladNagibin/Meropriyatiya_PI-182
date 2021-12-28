const {model, Schema}=require('mongoose')
const schema = new Schema({
    name:{
        type: String,
        required:true
    }, 
    addGroups:{
        type:Boolean,
        required:true
    },
    addUsers:{
        type:Boolean,
        required:true
    },
    addRoles:{
        type:Boolean,
        required:true
    }

})
module.exports = model('role', schema)