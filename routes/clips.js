/**
 * Created by tpetel on 14/07/2015.
 */

var deeUserDB = require ('../db/dbUserConnect.js');
var deeClipDB = require ('../db/dbClipConnect.js');

var s3 = require('s3');

var client = s3.createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: {
        accessKeyId: "AKIAINHGGWPLHV72OB4A",
        secretAccessKey: "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",
        // any other options are passed to new AWS.S3()
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    },
});



//We have req.drest already with all user detail - no need to query the DB again!

var clips = {
    UploadNewClip: function(req, res, next) {

        var params = {
            localFile: "c:/temp/1.txt",

            s3Params: {
                Bucket: "userIDfolder",
                Key: "userClipID",
                // other options supported by putObject, except Body and ContentLength.
                // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            },
        };
        var uploader = client.uploadFile(params);
        uploader.on('error', function(err) {
            console.error("unable to upload:", err.stack);
        });
        uploader.on('progress', function() {
            console.log("progress", uploader.progressMd5Amount,
                uploader.progressAmount, uploader.progressTotal);
        });
        uploader.on('end', function() {
            console.log("done uploading");
        });





        //TODO: send a link for S3 to the app.
        //TODO: get a verification that the file uploaded successfully.
        //TODO: send a verification to the user.
        //TODO: transcode and get a link.
        //TODO: Update ClipDB and connect to UserDB.

        deeClipDB.create(req.body, function (err, dbRes){
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


    getAllUserClips: function(req, res,next) {
        //TODO: pull the two arrays from UserDB and query the ClipDB for each one
        //Can try to use var req.drest.clips = req.drest.clipsSent.concat(req.drest.clipsReceived)
        deeClipDB.find({
            '_id': { $in: [
            req.drest.clipsReceived,
           // req.drest.clipsSent
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