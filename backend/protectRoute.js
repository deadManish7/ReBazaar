const jwt = require('jsonwebtoken');
const jwt_key = 'manishakarshit123456789'


module.exports.protectRoute = function protectRoute(req,res,next){
    try{
    let payload = jwt.verify(req.body.token,jwt_key);
    
        req.id = payload.payload;
        next();
            
        }

    catch(err){
        res.send("0"); //User Not login 
        }
    }

module.exports.returnId = function returnId(req,res){

        try{
        let payload = jwt.verify(req.body.token,jwt_key);
        
            let user_id = payload.payload;
            res.json({
                id : user_id
            });
                
            }
    
        catch(err){
            res.send("0"); //User Not login 
            }
        }    

