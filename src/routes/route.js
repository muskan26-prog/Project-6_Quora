const express = require('express');

const router = express.Router();

let userController = require('../controllers/userController')
let questionController = require('../controllers/questionController')
let answerController = require('../controllers/answerController')

let midVerify = require('../middlewares/verify')

//USER ROUTES
router.post('/register',userController.createUser)
router.post('/login', userController.login)
router.get('/user/:userId/profile',midVerify.varifyUser, userController.getUser)
router.put('/user/:userId/profile',midVerify.varifyUser, userController.updateUser)

//QUESTION ROUTES
router.post('/question' ,midVerify.varifyUser, questionController.createQuestion)
router.get('/question', questionController.getQuestion)
router.get('/questions/:questionId',questionController.getQuestionById)

//ANSWER ROUTES
router.post('/answer', answerController.createAnswer)

module.exports = router;

