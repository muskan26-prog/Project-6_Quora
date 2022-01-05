let userModel = require('../models/userModel')
const validate = require('../validators/validator')
let bcryptjs = require('bcryptjs')
let jwt = require("jsonwebtoken");
const { isValidObjectId } = require('mongoose');
const { findOne } = require('../models/userModel');

//api for create User-->Localhost:3000/register
let createUser = async function(req,res){
    try{
        let reqBody = req.body

        //Validation for Request Body
        if(!validate.isValidRequestBody(reqBody)){
            return res.status(400).send({status: false, message: "Please provide valid User Details!!!"})
        }

        //Validation for each field in Request Body

        let {fname,lname,email,phone,password}=reqBody

        if(!validate.isValid(fname)){
            return res.status(400).send({status: false, message: "Please provide First Name!!"})
        }

        if(!validate.isValid(lname)){
            return res.status(400).send({status: false, message: "Please provide Last Name!!"})
        }

        //Validation for email

        if(!validate.isValid(email)){
            return res.status(400).send({status: false, message: "Please provide Email Address!!"})
        }

        email = email.trim()
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return res.status(400).send({status: false, message: `${email} is not a valid email Id. Please provide valid Email Address!!`})
        }

        let isEmailAlreadyUsed = await userModel.findOne({email : email})
        if(isEmailAlreadyUsed){
            return res.status(400).send({status: false, message: `${email} is already registered. Please provide unique Email Address!!`})
        }

        //Validation for Phone Nymber
        
        phone = phone.trim()
        if(!/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(phone)){
            return res.status(400).send({status: false, message: `${phone} is not a valid phone Number. Please provise valid Phone Number!!`})
        }

        let isPhoneNumberAlreadyUsed = await userModel.findOne({phone: phone})
        if(isPhoneNumberAlreadyUsed){
            return res.status(400).send({status: false, message: `${phone} is already registered. Please provide unique Phone Number!!`})
        }

        //Validation for Password

        if(!validate.isValid(password)){
            return res.status(400).send({status: false, message: "Please provide Password!!"})
        }

        if(! password.length >=8 && password.length <= 15){
            return res.status(400).send({status: false, message: "Password length should be in between 8 to 15 characters!!"})
        }
        //Validation Ends...

        let encryptPassword = await bcryptjs.hash(password,10)

        let combineAllFields={
            fname,
            lname,
            email,
            phone,
            password : password ? encryptPassword : "Password is Required!!"
        }

        let createUser = await userModel.create(combineAllFields)
        res.status(201).send({status: true, message: "User Successfully registered!!", data : createUser})
    }catch(err){
        res.status(500).send({status: false, message: err.message})
    }
}

let login = async function(req, res){
    try{
        const requestBody = req.body;
            if (!validate.isValidRequestBody(requestBody)) {
                return res.status(400).send({status: false,message: "Invalid request parameters. Please provide login details!!",});
            }
            // Extract params
            let { email, password } = requestBody;
            // Validation starts
            if (!validate.isValid(email)) {
                return res.status(400).send({ status: false, message: `Email is required` });
            }
            email=email.trim()
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                res.status(400).send({ status: false, message: `${email} is not a valid email` });
                return;
            }

            if (!validate.isValid(password)) {
                return res.status(400).send({ status: false, message: `Password is required` });
            }
            // Validation ends
            const user = await userModel.findOne({ email: email });
            if (!user) {
                return res.status(401).send({ status: false, message: `Invalid login credentials` });
            }

            let decPass = await bcryptjs.compare(password, user.password);
            if (decPass) {
                const token = jwt.sign({ userId: user._id }, "radium", {expiresIn: "2h",});
                return res.status(200).send({status: true,message: `User login successfully 😁🤟🏻`,data: { userId: user._id, token },});
            } else {
                res.status(401).send({ status: false, message: "invalid password" })
            }
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
}

//api for get User--->localhost:3000/user/:userId/profile 
let getUser = async function(req, res){
    let userId = req.params.userId

    if(!validate.isValidObjectId(userId)){
        return res.status(400).send({status: false, message: `${userId} is not a valid Id. Please enter valid ObjectId!!`})
    }
    if(req.userId === userId){
        let getUserDetails= await userModel.findById({_id: userId})
        if(getUserDetails){
            res.status(200).send({status:true, data : getUserDetails})
        }
    }else{
        res.status(401).send({status:false, message: "Unauthorised User!!"})
    }
}

//api for update users detail---->localhost:3000/user/:userId/profile
let updateUser = async function(req, res){
    let reqBody = req.body
    let userId = req.params.userId
    let tokenUserId = req.userId

    if(!validate.isValidObjectId(userId)){
        return res.status(400).send({status: false, message: `${userId} is not a valid Id. Please enter valid ObjectId!!`})
    }
    
    let findUser = await userModel.findById({_id: userId})
    if(!findUser){
        res.status(404).send({status:false, message: `User Not found with this ${userId}`})
    }
    if(!validate.isValidRequestBody(reqBody)){
        return res.status(200).send({status: true, message: "Unmodified data", data: findUser})
    }

    if(userId === tokenUserId){
        let{fname,lname,email,phone} = reqBody
        if(Object.prototype.hasOwnProperty.call(reqBody,'fname')){
            if(!validate.isValid(fname)){
                return res.status(400).send({status: false, message: "Please provide First Name!!"})
            }
        }

        if(Object.prototype.hasOwnProperty.call(reqBody,'lname')){
            if(!validate.isValid(lname)){
                return res.status(400).send({status: false, message: "Please provide Last Name!!"})
            }
        }

        if(Object.prototype.hasOwnProperty.call(reqBody,'email')){
            if(!validate.isValid(email)){
                return res.status(400).send({status: false, message: "Please provide Email Address!!"})
            }

            email=email.trim()
            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
                return res.status(400).send({status: false, message: `${email} is not a valid email Id. Please provide valid Email Address!!`})
            }

            let isEmailAlreadyUsed = await userModel.findOne({email: email})
            if(isEmailAlreadyUsed){
                return res.status(400).send({status: false, message: `${email} is already registered. Please provide unique Email Address!!`})
            }
        }

        if(Object.prototype.hasOwnProperty.call(reqBody,'phone')){
            phone=phone.trim()
            if(!/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(phone)){
                return res.status(400).send({status: false, message: `${phone} is not a valid phone Number. Please provise valid Phone Number!!`})
            }

            let isPhoneNumberAlreadyUsed = await userModel.findOne({phone: phone})
            if(isPhoneNumberAlreadyUsed){
                return res.status(400).send({status: false, message: `${phone} is already registered. Please provide unique Phone Number!!`})
            }
        }

        let updateUser = {fname,lname,email,phone}
        let updatedData = await userModel.findOneAndUpdate({_id: userId},updateUser,{new:true})
        res.status(200).send({status:true, message: "User Information Updated Successfully!!", data: updatedData})        
    }else{
        res.status(401).send({status: false, message: "Unauthorised User!!"})
    }
}

module.exports = {createUser,login,getUser,updateUser}