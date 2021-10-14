const {model, Schema}=require('mongoose')
const schema = new Schema({
    name:{
        type:String,
        required:true
    },
    dayOfEvent:{
        type:String,
        required:true
    },
    timeOfEvent:{
        type:String,
        required:true
    },
    location:{
        type:String
    }
})
module.exports = model('event', schema)