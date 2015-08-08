/**
 * Created by tpetel on 13/07/2015.
 */

var mongoose = require ('mongoose');

var dbUser = mongoose.createConnection('mongodb://127.0.0.1:27017/deeUser', function(err) {
    if(err) {
        console.log('connection error to user DB', err);
    } else {
        console.log('connection successful to user DB');
    }
});

var Schema = mongoose.Schema;

var mySchema = new Schema ({
    fullname: { type: String, required: true},
    email: {type: String, required: false},
    verified: { type: Boolean, default: false},
    tokenObj : Object, //need to save hashed
    //udid: String,
    // country: String,
    osversion: String,
    ostype : String,
    deeversion: String,
    //location: String,
    //language: String,
    dateRegistered: { type: Date, default: Date.now },
    clipsSent: {type: Array, default:[]},
    clipsReceived: {type: Array, default:[]},
});

module.exports = dbUser.model('userModel',mySchema);
