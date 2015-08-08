/**
 * Created by tpetel on 14/07/2015.
 */
//TODO: Apply GenToken and email in both cases (one: new user. second: returning user after clear cache/new device/format.)
//TODO: create another secret file for one-time token
//TODO: scenario: lookup a user and if exists send him a new temp token (e.g for new devices)
//TODO: find out why findOne returns a model and not an object.
//TODO: when clicking the link - what VERB will it have?

var sendgrid = require('sendgrid')("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");
var jwt = require('jwt-simple');
var deeTokenDB = require ('../db/dbTokenConnect.js');
var deeUserDB = require ('../db/dbUserConnect.js');

module.exports = function (req, res, next){
    //Check if email already exists
    deeTokenDB.findOne({"email": req.body.email},function(err, post){
        //if exist update current data overriding the old data. If not create a record. generate a token. send an email
        if (err) return next(err);
        var userToken = genToken(req.body.email);
        req.drest = req.body;
        //Getting misc. information
        req.drest.osversion = req.headers["x-drest-osversion"];
        req.drest.deeversion = req.headers["x-drest-deeversion"];
        req.drest.ostype = req.headers["x-drest-ostype"];
        req.drest.tokenObj = userToken;

        if (post){
            //Record exist = user exists or trying so signup again
            console.log("You are an existing user, I will provide you with a new token");
            // Getting new information from the user.
            post.tokenObj = userToken;
            post.activated = false;
            post.fullname = req.drest.fullname;
            post.osversion = req.drest.osversion;
            post.deeversion = req.drest.deeversion;
            post.ostype = req.drest.ostype;
                if (post.linked){
                    // User record exists = existing user.
                    deeUserDB.findById(post.userObjId,function(err,doc){
                        if (err) next (err);
                        if (doc.fullname != post.fullname){
                            doc.fullname = post.fullname;
                            doc.save();
                            //Updating full name field in UserDB
                        }
                    });
                }
            post.save();
            //TODO: Application: user already exists - search for existing local clips on device - Gal & Roee
        }

        else {
            // Record not exists = new User.
            console.log("You are a new user, let's create a record in TokenDB for you");
            //Getting fullname and email from the client
            deeTokenDB.create(req.drest, function (err, dbRes) {
                if (err) return next(err);
                console.log("New Record in TokenDB" + dbRes);
            });
        }
        var host = '127.0.0.1:3000';
        var payload = {
            to: req.drest.email,
            from: "no-replay@deerestapp.com",
            subject: "Hey, you're new to Deerest...",
            text: 'Hello!\nAccess your account here: http://' + host + '?token=' + req.drest.tokenObj.token
        };      //When user will open the link it will return to another middleware and verify the account
        sendgrid.send(payload, function (err, json) {
            if (err) next(err);
            res.json("Please Check your inbox");
        });
    });

};


//Private functions
function genToken(email) {
    var expires = expiresIn(1); // 1 days
    var token = jwt.encode({
        exp: expires,
        email: email,
    }, require('../config/jwtSec')());
    return {
        token: token,
        exp: expires
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}