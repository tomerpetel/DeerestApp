
var mongoose = require ('mongoose');

var dbToken = mongoose.createConnection('mongodb://127.0.0.1:27017/deeToken', function(err) {
    if(err) {
        console.log('connection error to Token DB', err);
    } else {
        console.log('connection successful to Token DB');
    }
});

var Schema = mongoose.Schema;

var mySchema = new Schema ({
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    tokenObj: {type: Object, required: true},
    udid: String,
    activated: { type: Boolean, default: false},
    linked: {type: Boolean, default: false},
    userObjId: Schema.Types.ObjectId,
    osversion: String,
    ostype : String,
    deeversion: String,
    dateRegistered: { type: Date, default: Date.now },
    dateActivated: { type: Date },
});


module.exports = dbToken.model('tokenModel', mySchema);
//module.exports = tokenConn;

