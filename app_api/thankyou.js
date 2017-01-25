var mongoose = require('mongoose');

session.dialogData.appreciationVerb, session.dialogData.recipient, session.dialogData.reason

var thankYouSchema = new mongoose.Schema({
    appreciationVerb: { type: String, required: true },
    recipient: { type: String, required: true },
    reason: { type: String, required: true },
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

mongoose.model('ThankYou', thankYouSchema);