/**
 * Created by tpetel on 13/07/2015.
 */

var mongoose = require('mongoose');

var dbUserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required: true},
    verified: { type: Boolean, default: false},
    token : String, //need to save hashed
    //password: { type: String, required: true },
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

module.exports = mongoose.model('deeUserDB', dbUserSchema);
/*
 If it was a variable then we would have create a new DB using
 var newDB =  mongoose.model('deeDB', dbSchema);

 */
/**
 * Created by tpetel on 14/07/2015.
 */
