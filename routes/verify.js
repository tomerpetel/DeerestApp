/**
 * Created by tpetel on 25/07/2015.
 */
    //Verifying the account after an email has been sent.
var deeTokenDB = require ('../db/dbTokenConnect.js');
var deeUserDB = require ('../db/dbUserConnect.js');

var jwt = require('jwt-simple');

module.exports = {

    verifyToken: function (req, res, next) {
        //Decoding our registration Token
        var token = req.query.token;
        if (token) {
            try {
                var decoded = jwt.decode(token, require('../config/jwtSec.js')());

                if (decoded.exp <= Date.now()) {
                    res.status(400);
                    res.json({
                        "status": 400,
                        "message": "Token Expired, Please re-signup"
                    });
                    return;
                    //TODO: Application: return to signup screen
                }
            }
            catch (err) {
                res.status(500);
                res.json({
                    "status": 500,
                    "message": "Oops something went wrong",
                    "error": err
                });
            }
        }
        else {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid Token or Key"
            });
            return;
            //TODO: Application: return to signup screen
        }
        // query.token is from the URL parser in Express
        deeTokenDB.findOne({"tokenObj.token": req.query.token}, function (err, post) {
            req.usrInfo = post;
            if (err) return next(err);
            if (post) { // Email verification passed - need to generate a permanent token
                req.tokenObj = genToken(req.usrInfo.fullname, req.usrInfo.email);
                if (post.email == decoded.email && post.linked) {
                    //Existing user - there is a record in UserDB
                    post.activated = true;
                    post.dateActivated = Date.now;
                    post.save();
                    //TODO: need to see if post.save() above is working
                    console.log("You are an existing user, no need to create a record in UserDB");
                    // Updating permanent token in UserDB for an existing user
                    deeUserDB.findByIdAndUpdate(post.userObjId, {
                        "tokenObj":{
                            token: req.tokenObj.token,
                            expires : req.tokenObj.expires
                                }
                        },function (err, res){
                            if (err) next (err);
                            console.log (res);
                        }
                    );
                    next();
                }

                else if (post.email == decoded.email) {

                    //New user, need to create a UserDB record
                    deeUserDB.create({
                            "fullname": post.fullname,
                            "email": post.email,
                            "udid": post.udid,
                            "osversion": post.osversion,
                            "ostype": post.ostype,
                            "deeversion": post.deeversion,
                            "tokenObj":{
                                token: req.tokenObj.token,
                                expires : req.tokenObj.expires
                            }
                        },
                        function (err, dbres) {
                            if (err) next(err);
                            console.log("New User record id " + dbres._id);
                            // Linking between the TokenDB record and UserDB record
                            req.drest = {
                                _id: post._id, //TokenDB ID record
                                activated: true,
                                linked: true,
                                userObjId: dbres._id // UserDB ID record
                            };

                            next();
                        });

                }
                //TODO: Application: Store this token to use in the header x-deerest-token



            }
            else {
                res.json("User was not found in TokenDB");
            }

        });
    },
    linkToUserDB: function (req, res, next) {
        if (req.drest) {
        //Record not empty = new User
        deeTokenDB.findByIdAndUpdate(req.drest._id, {
            "activated": req.drest.activated,
            "dateActivated": Date.now(),
            "linked": req.drest.linked,
            "userObjId": req.drest.userObjId
        }, function (err, dbres) {
            if (err) next(err);
            console.log(dbres);
        });
    }
        res.json(req.tokenObj);
    }
};

function genToken(dbUser, dbEmail) {
    var expires = expiresIn(365); // 1 Year
    var token = jwt.encode({
        exp: expires,
        fullname: dbUser,
        email: dbEmail
    }, require('../config/jwtSec')());
    return {
        token: token,
        expires: expires,
        fullname: dbUser,
        email: dbEmail
    };
}
function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}


