var mongoose = require('mongoose');

var thankYouSchema = new mongoose.Schema({
    userid: { type: String },
    username: { type: String },
    appreciationVerb: { type: String, required: true },
    recipient: { type: String, required: true },
    reason: { type: String, required: true },
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

mongoose.model('ThankYou', thankYouSchema);