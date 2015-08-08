/**
 * Created by tpetel on 13/07/2015.
 */

var mongoose = require('mongoose');

var dbTokenSchema = tokenConn.model('Model',new mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    tokenObj: {type: String, required: true},
    udid: String,
    activated: { type: Boolean, default: false},
    linked: {type: Boolean, default: false},
    userObjId: Schema.Types.ObjectId,
    osversion: String,
    ostype : String,
    deeversion: String,
    //Date when E-mail was sent
    dateRegistered: { type: Date, default: Date.now },
    //Date when user has activated the account (enter the link at the mail)
    dateActivated: { type: Date },
}));

module.exports = mongoose.model('deeTokenDB', dbTokenSchema);
/*
 If it was a variable then we would have create a new DB using
 var newDB =  mongoose.model('deeDB', dbSchema);

 */
/**
 * Created by tpetel on 14/07/2015.
 */
