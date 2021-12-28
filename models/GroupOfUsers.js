const {model, Schema}=require('mongoose')
const schema = new Schema({
    users:{
        type:Array,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    date:{
        type:String
    },
    time:{
        type:String
    },
    startLocation:{
        type:String
    },
    events:{
        type:Array,
        required:true
    }
})
module.exports = model('groupOfUser', schema)