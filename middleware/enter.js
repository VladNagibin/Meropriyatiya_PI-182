const jwt = require('jsonwebtoken')
const {jwtSecret} = require('../config/app')
module.exports = (req,res,next)=>{
    const {cookies} = req
    if('UserHash' in cookies){
        //const token = authHeader.replace('Bearer ', '')
        try{
            jwt.verify(cookies.UserHash,jwtSecret)
            next();
        }
        catch(e){
            if (e instanceof jwt.JsonWebTokenError){
                res.status(201).json({message:"auth fail"})
            }
        }  
    }
    else{
        res.status(201).json({message:"auth fail"})
    }
    
    /*const authHeader = req.get('Authorization')
    if (!authHeader){
        res.redirect('/EnterInAccount')
    }*/
    
    
  


}