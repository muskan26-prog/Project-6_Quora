const { isValidObjectId } = require('mongoose')
let questionModel = require('../models/questionModel')
const userModel = require('../models/userModel')
const answerModel = require('../models/answerModel')
let validate = require('../validators/validator')

//API for create question---->localhost:3000/question
let createQuestion = async function(req,res){
    try{
        let reqBody = req.body
        let tokenUserId = req.userId
        let userId = reqBody.askedBy

        //Validation for Request Body
        if(!validate.isValidRequestBody(reqBody)){
            return res.status(400).send({status: true, message: "Please provide valid Details!!!"})
        }

        if(tokenUserId === userId){
            //Validation for fields in Request Body
            let {description,tag,askedBy} = reqBody

            if(!validate.isValid(description)){
                return res.status(400).send({status: false, message: "Please Provide description!!"})
            }

            if(!validate.isValidObjectId(askedBy)){
                return res.status(400).send({staus: false, message: `${askedBy} is not a valid ObjectId. Please provide valid objectId!!`})
            }

            if(reqBody.isDeleted === true){
                return res.status(400).send({status: false, message: "You can not delete field while creating!!"})
            }

            let findUser = await userModel.find({_id : userId})
            if(findUser.length !== 0){
                let createQuestion = await questionModel.create(reqBody)
                res.status(201).send({status: true, data: createQuestion })
            }else{
                return res.status(404).send({status: false, message: `User not found with this ${userId}`})
            }
            
        }else{
            res.status(401).send({status: false, message: "Unauthorised User!!!" })
        }
    }catch(err){
        res.status(500).send({status: false, message: err.message})
    }
}

//API for get Question----->localhost:3000/questions
let getQuestion = async function(req, res){

    let getQuestion = await questionModel.find({isDeleted: false})
    //console.log(getQuestion)
    let arr = []
    
    let answers = []
    for(let i=0; i<getQuestion.length; i++){
        let getQuestionId = getQuestion[i]._id
        // console.log(getQuestionId)
        let getAnswer = await answerModel.find({questionId: getQuestionId})
        answers= getAnswer.map(element => element.text)
        
        if(answers.length !== 0){ 
            arr.push(getQuestion[i])
            arr.push(answers)
        }
        // console.log(answers)
    }
    console.log(arr)
    
    res.status(200).send({status: true, data: arr})
    
}

//API for get question by ID----->localhost:3000/questions/:questionId 
let getQuestionById = async function(req, res){
    let questionId = req.params.questionId
    
    //Validation for questionId
    if(!validate.isValidObjectId(questionId)){
        return res.status(400).send({status: false, message: `${questionId} is not a valid ObjectId. Please provide valid objectId!!`})
    }
    let getQuestion = await questionModel.find({_id: questionId, isDeleted: false})
    if(getQuestion.length === 0){
        return res.status(404).send({status: false, message: `Question Not found with this ${questionId}`})
    }

    //Validation for answerId
    let getAnswer = await answerModel.find({questionId: questionId})
    let question = getQuestion.description
            
    if(getAnswer.length === 0){
        return res.status(404).send({status: false, Question : question , message: "Sorry Answer Not Found for this question!!"})
    }

    //storing each answer in array
    const answers= getAnswer.map(element => element.text);
    
    res.status(200).send({status: true, message: "success", data : getQuestion,answers})
}

module.exports = {createQuestion,getQuestion,getQuestionById}