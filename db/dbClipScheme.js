/**
 * Created by tpetel on 13/07/2015.
 */

//TODO: do I need to pointer back to User DB or one direction is enough?

var mongoose = require('mongoose');

var dbClipSchema = new mongoose.Schema({
    nameOfClip: String,
    thumbnail: String,
   // username: { type: String, required: true, unique: true },
    views: {type: Number, default: 0},
    length: Number, //In seconds
    qrCode: String,
    //link: String,
    sizeInMB: Number,
    dateTaken: { type: Date, default: Date.now },
    uploadDone: {type: Boolean, default: false},
    dateUploaded: { type: Date, default: Date.now },
    codec: String,
    resolution: String,
    //public: {type: Boolean, default: false}, //for sharing your clip for public view
    //type: { type: String, enum: ['Wedding', 'Birthday', 'Other Special Occasion']},
});

module.exports = mongoose.model('deeClipDB', dbClipSchema);
/*
If it was a variable them we would have create a new DB using
var newDB =  mongoose.model('deeDB', dbSchema);

*/
