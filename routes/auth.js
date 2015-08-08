/**
 * Created by tpetel on 14/07/2015.
 */
var jwt = require('jwt-simple');
//TODO: check whether to have a token with no expiration to keep the login. what to do in case token has been deleted.
var mongoose = require('mongoose');
var deeDB = require ('../db/dbUserConnect.js');

module.exports = function (req, res, next){
    var username = req.body.username || ''; //if req.body.username is undefined/null/false it'll pick the second
    var password = req.body.password || ''; //operand
    if (username == '' || password == '') {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid credentials, Empty username or password"
        });
        return;
    }
        deeDB.findOne ({"username": req.body.username}, function (err,dbRes){
           if (err) next(err);
            if (dbRes) {
                if (dbRes.password == req.body.password){
                    //req.deeData = dbRes;
                    dbUser = dbRes.username;
                    res.json(genToken(dbUser));
                }
                else {
                    res.status(401);
                    res.json({
                    "status": 401,
                    "message": "Invalid credentials, Password Incorrect"
                     });
                }
            }
            else {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid credentials, User not found"
                });
                //next();
            }
            });
};
//Need to add the client browser version for security if someone steals the token
// private method
function genToken(dbUser) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires,
        username: dbUser
    }, require('../config/jwtSec')());
    return {
        token: token,
        expires: expires,
        username: dbUser
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}