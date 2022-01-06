const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

let questionSchema = new mongoose.Schema({
        description: {type: String, required: "Question is mandatory"} ,
        tag: {type: [String]},
        askedBy: {type: objectId, ref: 'myUser'},
        deletedAt: {type: Date, default: null}, 
        isDeleted: {type: Boolean, default: false},
},{timestamps: true})
module.exports = mongoose.model('myQuestion',questionSchema) 