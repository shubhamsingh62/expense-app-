const jwt = require('jsonwebtoken')
const shortid = require('shortid')
const secretKey = "AstringThatNoBodyCanGuess"

let genrateToken = (data,cb) =>{
    try{ 
    let clamis = {
         jwtid: shortid.generate(),
         iat: Date.now(),
         exp:Math.floor(Date.now() / 1000) + (60*60*24),
         sub:'authToken',
         iss:'chat',
         data:data
    
     }
     let tokenDetails = {
          token:jwt.sign(clamis,secretKey),
          tokensecret:secretKey
     }
     cb(null,tokenDetails)
    }
     catch(err){
         console.log(err)
         cb(err,null)
     }
  
}

let verifyClaim = (token,cb) =>{
    jwt.verify(token,secretKey,function(err,decode){
        if(err){
            console.log('error while verifing token')
            console.log(err);
            cb(err,null)
        }else{
            console.log('user verified')
            console.log(decode);
            cb(null,decode)
        }
    })
}

let verifyClaimWithoutSecret = (token,cb) => {
    // verify a token symmetric
    jwt.verify(token, secretKey, function (err, decoded) {
      if(err){
        console.log("error while verify token");
        console.log(err);
        cb(err,data)
      }
      else{
        console.log("user verified");
        cb (null,decoded)
      }  
   
   
    });
  
  
  }

module.exports = {
    genrateToken:genrateToken,
    verifyToken:verifyClaim,
    verifyClaimWithoutSecret:verifyClaimWithoutSecret
}