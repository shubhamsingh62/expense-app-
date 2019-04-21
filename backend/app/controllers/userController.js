const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('./../libs/generatePasswordLib');
const token = require('../libs/tokenLib');
const multer = require('multer');

// const path = require('path');
// const fs = require('fs');


/* Models */
const UserModel = mongoose.model('User')
const AuthModel = mongoose.model('Auth')
const TaskModel = mongoose.model('Task')







// start user signup function 


let getAllUser = (req, res) => {
    UserModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err) 
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users

let getSingleUser = (req, res) => {
    UserModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user

let deleteUser = (req, res) => {
    UserModel.findOneAndRemove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user

let editUser = (req, res) => {
    let options = req.body;
    UserModel.update({ 'userId': req.params.userId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
        }
    });// end user model update


}// end edit user

let signUpFunction = (req, res) => {    
    let validateUserInput = ()=>{
      return new Promise((resolve,reject)=>{
      if(req.body.email){
          if(!validateInput.Email(req.body.email)){
            let apiResponse = response.generate(true,'email not matches',400,null)
            reject(apiResponse)
          }else if(!req.body.password){
              let apiResponse = response.generate(true,'password is not matching',400,null)
              reject(apiResponse)
          }else{
              resolve(req)
          }
      }else {
          logger.error('Field is missing during user creation','userControler:usercontrolaer',5)
          let apiResponse = response.generate(true,"one are more parameter are missing",400,null)
          reject(apiResponse)
      }
      })
  }
  let createUser = () =>{
      return new Promise((resolve,reject)=>{
          UserModel.findOne({email:req.body.email})
          .exec((err,retrivedUserDetails)=>{
              if(err){
                  logger.error(err.message,'userControler:createUser',10)
                  let apiResponse = response.generate(true,'failed to create user',404,null)
                  reject(apiResponse)

              }else if(check.isEmpty(retrivedUserDetails)){
                //   console.log(req.body)
                  let newUser = UserModel({
                      userId:shortid.generate(),
                      firstName:req.body.firstName,
                      lastName:req.body.lastName || '',
                      email:req.body.email.toLowerCase(),
                      mobileNumber:req.body.mobileNumber,
                      password:passwordLib.hashpassword(req.body.password),
                      createdOn:Date.now()
                  })
                  console.log('***new user data***')
                  console.log(newUser)
                newUser.save((err,newUser) => {
                    if(err){
                    logger.error(err.message,'userControler:createuser',10)
                    let apiResponse = response.generate(true,'failed to create new user',500,null)
                    reject(apiResponse)
                    }else{
                        let newUserObj = newUser.toObject()
                        resolve(newUserObj)
                    }
                })

              }else{
                  logger.error('user can not be created user all ready exist','userControler:createuser',10)
                  let apiResponse = response.generate(true,'user all ready exist',400,null)
                  reject(apiResponse)

              }
          })
      })
  }

  validateUserInput(req,res)
        .then(createUser)
        .then((resolve)=>{
            delete resolve.password
            let apiResponse = response.generate(false,'user created',200,resolve)
            res.send(apiResponse)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })


}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {

    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ email: req.body.email}, (err, userDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });
                
            } else { 
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.genrateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
   
    let saveToken = (tokenDetails) =>{
        console.log("save Token")
        return new Promise((resolve , reject)=>{
            AuthModel.findOne({userId:tokenDetails.userId},(err,retrivedTokenDetails)=>{
                if(err){
                    logger.error(err.message,'usercontroler:saveToken',10)
                    let apiResponse = response.generate(true,'failed to genrate Token',500,null)
                    reject(apiResponse)
                }else if(check.isEmpty(retrivedTokenDetails)){
                    let newAuthToken = new AuthModel({
                        userId:tokenDetails.userId,
                        authToken:tokenDetails.authToken,
                        tokenSecret:tokenDetails.tokenSecret,
                        tokenGenerationTime:time.now()
                    })
                  newAuthToken.save((err,newTokenDetails)=>{
                        if(err){
                            logger.error(err.message,'usercontroler:savetoken',10)
                            let apiResponse = response.generate(true,'failed to genrate token',500,null)
                            reject(apiResponse)
                        }else{
                            let responseBody = {
                                authToken:newTokenDetails.authToken,
                                userDetails:tokenDetails.userDetails
                            } 
                            resolve(responseBody)
                        }
                  })  
                }else {
                    retrivedTokenDetails.authToken = tokenDetails.token
                    retrivedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrivedTokenDetails.tokenGenerationTime = time.now()
                    retrivedTokenDetails.save((err,newTokenDetails)=>{
                        if(err){
                            logger.error(err.message,'usercontroler:savetoken',10)
                            let apiResponse = response.generate(true,'failed to genrate token',500,null)
                            reject(apiResponse)
                        }else{
                            let responseBody = {
                                authToken:newTokenDetails.authToken,
                                userDetails:tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } 
            })
        })
    }


    findUser(req,res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
    
}

// end of the login function 

//create task 
let createexpences = (req,res)=>{
  var today = Date.now()
  let expencesId = shortid.generate();

  let newTask = new TaskModel({
    expencesId:expencesId,
    name:req.body.name,
    price:req.body.price,
    category:req.body.category,
    created:today,
    lastModified:today
 })

 // let tags = (req.body.tags!= undefined && req.body.tags != null && req.body.tags != '')?req.body.tags.split(','):[]
 // newBlog.tags = tags;

 newTask.save((err,result)=>{
     if(err){
         console.log(err);
         logger.error(err.message, 'user Controller: create', 10)
         // let apiResponse = response.genrate(false,'some error occured',500,null);
            res.send('failed');
     }else{
        // let apiResponse = response.genrate(true,'succesfully created',200,result);
        res.send('success');
     }
 })
}

let getAlldata = (req , res)=>{
    TaskModel.find()
             // .select('-_V -_id')
             .lean()
             .exec((err, result)=>{
                 if(err){
                    logger.error(err.message, 'user Controller: getAlldata', 10)
                    let apiResponse = response.generate(false,'some error occured',500,null);
                    res.send(apiResponse)
                 }else if(check.isEmpty(result)){
                    logger.info('No Blog Found', 'Blog Controller: getAllBlog')
                     console.log('no blog found');
                     let apiResponse = response.generate(false,'data not found',404,null);
                     res.send(apiResponse)

                 }else{
                    let apiResponse = response.generate(true,'succesfully find all',200,result);
                      res.send(apiResponse);
                 }

             })
}

// for file upload

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname + '-' + Date.now())
    }
});

var upload = multer({storage: storage}).single('file');


let fileupload = (req , res)=>{
    upload(req ,res, (err)=>{
        if(err){
            res.status(501).json({error:err})
        }

        return res.json({originalname:req.file.originalname, uploadname:req.file.filename})
    })
}



module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    getAllUser:getAllUser,
    getSingleUser:getSingleUser,
    deleteUser:deleteUser,
    editUser:editUser,
    fileupload:fileupload,
    createexpences:createexpences,
    getAlldata:getAlldata

}// end exports