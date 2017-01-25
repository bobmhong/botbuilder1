var restify = require('restify');
var builder = require('botbuilder');
var log = require('npmlog');

require('./api/model/db');
var mongoose = require('mongoose');
var ThankYou = mongoose.model('ThankYou');
//=========================================================
// Bot Setup
//=========================================================

var nlu_url = process.env.NLU_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d86b48cd-8cae-4cd4-abc7-6160c0accb54?subscription-key=814d4b1ad3764d4b85ba45d4e825d4c4&verbose=true';

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    log.info('Server Init', '%s listening to %s', server.name, server.url);
    log.info('Server Init', 'MS APP ID: %s MS APP PW: %s', process.env.MICROSOFT_APP_ID, process.env.MICROSOFT_APP_PASSWORD);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

/*bot.dialog('/', function (session) {
    session.send("Hello World");
});
*/
var recognizer = new builder.LuisRecognizer(nlu_url);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

bot.dialog('/', intents);

intents.matches('SendThanks', [
    function(session, args, next) {
        var address = JSON.stringify(session.message.address);

        log.info('SendThanks Intent', 'Address: %j', session.message.address);
        log.info('SendThanks Intent', 'Entities: ', JSON.stringify(args.entities));
        // save the passed args in the session
        var recipient = builder.EntityRecognizer.findEntity(args.entities, 'recipient');
        if (recipient) {
            session.dialogData.recipient = recipient.entity;
        }
        var appreciationVerb = builder.EntityRecognizer.findEntity(args.entities, 'appreciationVerb');
        if (appreciationVerb) {
            session.dialogData.appreciationVerb = appreciationVerb.entity;
        }
        var reason = builder.EntityRecognizer.findEntity(args.entities, 'reason');
        if (reason) {
            session.dialogData.reason = reason.entity;
        }
        if (!session.dialogData.recipient) {
            builder.Prompts.text(session, "Who would you like to thank?");
        } else {
            next();
        }
    },

    function(session, results, next) {
        if (results.response) {
            session.dialogData.recipient = results.response;
        }
        if (!session.dialogData.appreciationVerb) {
            builder.Prompts.text(session, "How would you like to show your appreciation?  example: say thanks, thank, give a high five, recognize, etc...");
        } else {
            next();
        }
    },
    function(session, results, next) {
        if (results.response) {
            session.dialogData.appreciationVerb = results.response;
        }
        if (!session.dialogData.reason) {
            builder.Prompts.text(session, "Why are you thankful?");

        } else {
            next();
        }
    },
    function(session, results) {
        if (results.response) {
            session.dialogData.reason = results.response;
        }
        session.sendTyping();
        ThankYou.create({
            userid: session.message.address.user.id,
            username: session.message.address.user.name,
            appreciationVerb: session.dialogData.appreciationVerb,
            recipient: session.dialogData.recipient,
            reason: session.dialogData.reason
        }, function(err, location) {
            if (err) {
                log.info('Oops, there was a problem saving your thank you. ', err);
                session.send('Oops, there was a problem saving your thank you. ', err);
                session.endDialog();
            } else {
                log.info('Sending Thanks...', "Ok...%s to %s for %s.", session.dialogData.appreciationVerb, session.dialogData.recipient, session.dialogData.reason);
                session.send("Ok...%s to %s for %s.", session.dialogData.appreciationVerb, session.dialogData.recipient, session.dialogData.reason);
                session.endDialog();
            }
        });
    }
]);

intents.matches('help',
    function(session, results) {
        session.send("Thank you bot is an easy and fun way to say thanks.  For example, say:\nThanks mom for making my lunch!", results);
    }
);