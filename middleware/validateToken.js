/**
 * Created by tpetel on 14/07/2015.
 */
var jwt = require('jwt-simple');
var deeUserDB = require ('../db/dbUserConnect.js');

module.exports = function (req, res, next){

    //Getting the token from the user
    var token = req.headers['x-drest-token'];

    //var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    //var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
        //change the key to the client version for another layer of protection

    //Try catch is for things that is out of your control, like decode the Token
    if (token) {
        try {
            var decoded = jwt.decode(token, require('../config/jwtSec.js')());

            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                    /* TODO: Need to figure out what to do if user's token had expired. Maybe to check if in DB and generate a new one. */
                });
                return;
            }
        }
        catch (err){
            res.status(500);
            res.json({
                "status": 500,
                "message": "Oops something went wrong",
                "error": err
            });
        }
    }
    else {
        res.status(400);
        res.json({
            "status": 400,
            "message": "Bad Request, no token was found"
        });
        return;
    }
    deeUserDB.findOne({"email": decoded.email, "fullname": decoded.fullname}, function(err, post){
        if (err) next(err);
            if (post){
                req.drest = post; //Getting user record to drest for future use
                next();
            }
                else{
                res.status(403);
                res.json({
                    "status": 403,
                    "message": "Invalid Token, access forbidden"
                });
            }


    });
};