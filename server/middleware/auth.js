
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined'){
       
        req.token = bearerHeader;
        jwt.verify(bearerHeader, process.env.JWT_SECRET, (err, authData) => {
            if(err){
                res.status(403).json(err);
            }else{
                req.user = authData.user;
                next();
            }
        })
    }else{
        res.status(403).send("Invalid token");
    }
     
}


  module.exports = verifyToken
