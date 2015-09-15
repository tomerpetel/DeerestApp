/**
 * Created by tpetel on 13/07/2015.
 */

var mongoose = require ('mongoose');

var dbClip = mongoose.createConnection('mongodb://127.0.0.1:27017/deeClip', function(err) {
    if(err) {
        console.log('connection error to Clips DB', err);
    } else {
        console.log('connection successful to Clips DB');
    }
});

var Schema = mongoose.Schema;

var mySchema = new Schema({
    nameOfClip: String,
    thumbnail: String,
    views: {type: Number, default: 0},
    length: Number,
    qrCode: String,
    link: String,
    sizeInMB: Number,
    dateTaken: { type: Date, default: Date.now },
    uploadDone: {type: Boolean, default: false},
    dateUploaded: { type: Date, default: Date.now },
    codec: String,
    resolution: String,
   // public: {type: Boolean, default: false}, //for sharing your clip for public view
   // type: { type: String, enum: ['Wedding', 'Birthday', 'Other Special Occasion']},
});

module.exports = dbClip.model('clipModel',mySchema);