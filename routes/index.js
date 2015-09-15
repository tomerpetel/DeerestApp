var express = require('express');
var router = express.Router();

//var mongoose = require('mongoose');
//var deeDB = require ('../db/dbConnect.js');
//var auth = require ('./auth.js');
var clips = require ('./clips.js');
var signup = require ('./signup.js');
var verify = require ('./verify.js');

router.post('/signup', signup);
router.get('/signup', verify.verifyToken, verify.linkToUserDB);

//TODO: each user will have its own path for clips based on UserID
router.post('v1/user/clips', clips.UploadNewClip);
router.get('/v1/user/clips', clips.getAllUserClips);

//router.post('/login', auth);

/*
 * Routes that can be accessed only by authenticated users
 */

// Derazon: DELETE /api/v1/users (users is a resource, this is RESTful design)

//TODO: Create a landing page for web-view.
// /username/clips
//TODO: not router.get('/api/v1/clips/', clips.getTopTenClips); but use a query on /clip?query...
//TODO: use patch if need to make change (NOT post)
/*

router.post('/v1/user/clips', clips.createNewClip);
router.patch('/v1/user/clips', function(req, res, next){});
 //router.get('/api/v1/clips/', clips.getTopTenClips);

 router.post('/api/v1/clips/:username', clips.GetClipFromQR);
 //router.delete('/api/v1/product/:id', products.delete);
*/


/*


/!* GET home page. *!/
router.get('/', function(req, res, next) {
     deeDB.find({}, function (err,post){
         if (err) return next(err);
         res.json(post);
     })
      console.log("Middleware 1")
  //res.render('index', { title: 'Express' });
      next();
}
,function(req, res, next){
      console.log("Middleware 1.1");
    }
);

router.get('/:uname', function (req, res, next){
    if (req.params.uname){
        deeDB.findOne({"username": req.params.uname}, function (err, post){
            if (err) return next(err);
            if (post)
                res.json(post);
            else res.json("Not in DB");
        });
    }
    //When there is a res.json no need to apply next(). it's non-blocking and it will lead
    //to an error because it will try the send something that was already been sent
    //next();
});

router.post('/', function (req, res, next){
    deeDB.create(req.body, function (err, post){
        if (err) return next(err);
        console.log ('Record in DB');
        res.json("Object created successfully");
    });
      //  next();
});

router.delete('/:uname', function (req, res, next){
    deeDB.findOne({"username":req.params.uname}, function (err, post){
        if (err) next(err);
        post.remove();
        res.json("Record has been removed");
    })

});

*/

module.exports = router;
