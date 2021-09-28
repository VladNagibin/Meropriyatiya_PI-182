const {model, Schema} = require('mongoose')

const schema = new Schema({
    title:{
        type: String,
        required: true
    },
    completed:{
        type:Boolean,
        default: false
    }
})
module.exports = model('todo', schema)