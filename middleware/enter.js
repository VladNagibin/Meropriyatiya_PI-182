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
                res.redirect('/EnterInAccount')
            }
        }  
    }
    else{
        res.redirect('/EnterInAccount')
    }
    
    /*const authHeader = req.get('Authorization')
    if (!authHeader){
        res.redirect('/EnterInAccount')
    }*/
    
    
  


}