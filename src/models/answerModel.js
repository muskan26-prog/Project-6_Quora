let mongoose = require('mongoose')
let objectId = mongoose.Schema.Types.ObjectId

let answerSchema = new mongoose.Schema({
    answeredBy: {type: objectId, ref: 'myUser', required: "answerId is required"},
    text: {type: String, required: "text is required"},
    questionId: {type: objectId, ref: 'myQuestion', required: "questionId is required"},
},{timestamps: true})

module.exports = mongoose.model('myAnswers',answerSchema)