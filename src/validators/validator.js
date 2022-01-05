let mongoose = require('mongoose')

let isValid = function(value){
    if(typeof value === null || typeof value === 'undefined')return false
    if(typeof value === 'string' && value.trim().length === 0)return false
    return true
}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length !== 0
}

const isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

module.exports = {isValid,isValidRequestBody,isValidObjectId}