let answerModel = require('../models/answerModel')

let createAnswer = async function(req, res){
    let reqBody = req.body
    let createAnswer = await answerModel.create(reqBody)
    res.status(201).send({status: true, data: createAnswer})
}

module.exports = {createAnswer}