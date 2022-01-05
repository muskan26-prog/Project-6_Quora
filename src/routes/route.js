const express = require('express');

const router = express.Router();

let userController = require('../controllers/userController')

let midVerify = require('../middlewares/verify')

//USER ROUTES
router.post('/register',userController.createUser)
router.post('/login', userController.login)
router.get('/user/:userId/profile',midVerify.varifyUser, userController.getUser)
router.put('/user/:userId/profile',midVerify.varifyUser, userController.updateUser)

module.exports = router;

