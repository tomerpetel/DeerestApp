/**
 * Created by tpetel on 14/07/2015.
 */
//var mongoose = require('mongoose');
var deeUserDB = require ('../db/dbUserConnect.js');
var deeClipDB = require ('../db/dbClipConnect.js');

//We have req.drest already with all user detail - no need to query the DB again!

var clips = {
    getAllUserClips: function(req, res,next) {
        //TODO: pull the two arrays from UserDB and query the ClipDB for each one
        //Can try to use var req.drest.clips = req.drest.clipsSent.concat(req.drest.clipsReceived)
        deeClipDB.find({
            '_id': { $in: [
            req.drest.clipsReceived,
            req.drest.clipsSent
        ]}
        },function (err, docs){
           if (err) next(err);
            res.json(docs);
        });
        /*res.json({
            "clipsSent": req.drest.clipsSent,
            "clipsReceived": req.drest.clipsReceived
    });*/

        /*deeUserDB.findOne({"username":req.deeData}, function (err, dbRes){
                //err means the user was authenticated but wasn't found, must be a DB error
                if (err) next(err);
                res.json(dbRes);
        });*/
    },
    getTopTenClips: function(req, res,next) {
       deeDB.find({}).sort({view: -1}).limit(10).exec(function (err, dbRes){
           if (err) next(err);
           res.json(dbRes);
       });
    },
    createNewClip: function(req, res,next) {
        deeDB.create(req.body, function (err, dbRes){
            if (err) return next(err);
            res.json({
                "message": "Starting to upload your clip, we will notify you when it's done",
                "db": dbRes
            });
            //it will get a link for uploading the clip and the upload will start from the client
            //using his token. once done the storage will generate a message to server and client
            //need to add boolean upload done field in DB
        });
    },
    GetClipFromQR: function(req, res,next) {
        deeDB.findOne({"qrcode": req.body.qrcode}, function (err, dbRes){
            if (err) next(err);
            //link this clip to my received clips
            //return a link/length/name to the user
            res.json("Clip...");
        })
    },
    /*delete: function(req, res) {
        var id = req.params.id;
        data.splice(id, 1) // Spoof a DB call
        res.json(true);
    }*/
};

module.exports = clips;