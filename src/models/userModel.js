const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    fname: {type: String, required: "fname is mandatory", trim: true},
    lname: {type: String, required: "lname is mandatory", trim: true},
    email: {type: String, required: "email is mandatory", unique: true},
    phone: {type: String, unique: true}, 
    password: {type: String, required: "password is mandatory", minLen: 8, maxLen: 15} // Encrypted password

},{timestamps: true})

module.exports = mongoose.model('myUser',userSchema)