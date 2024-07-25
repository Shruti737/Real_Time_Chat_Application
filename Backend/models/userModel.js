const mongoose = require('mongoose')

const  userSchema = mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 20,
        unique: true,
        required: true
    },
    email:{
        type:String,
        max:50,
        unique:true,
        required: true
    },
    password:{
        type:String,
        min:8,
        required: true
    },
    isAvatarImage:{
        type: Boolean,
        default: false,
    },
    avatarImage:{
        type: String,
        default: "",
    }
})

module.exports = mongoose.model("Users", userSchema) //Helps to connect the MongoDb with Node.js application.