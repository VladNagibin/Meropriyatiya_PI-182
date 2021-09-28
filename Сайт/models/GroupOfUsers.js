const {model, Schema}=require('mongoose')
const schema = new Schema({
    users:{
        type:Array,
        required:true
    },
    name:{
        type:String
    }
})
module.exports = model('groupOfUser', schema)