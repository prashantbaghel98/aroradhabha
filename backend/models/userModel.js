const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'user already exists'],
        required: true
    },
    email: {
        type: String,
        unique: [true, 'user already exists'],
        required: true
    }, 
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:['customer','admin','manager'],
        default:'customer'
    }
},{ timestamps:true})


const userModel = mongoose.model('User', userSchema)

module.exports = userModel ; 