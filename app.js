var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

var nlu_url = process.env.NLU_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d86b48cd-8cae-4cd4-abc7-6160c0accb54?subscription-key=814d4b1ad3764d4b85ba45d4e825d4c4&verbose=true';

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
    console.log('%s / %s', process.env.MICROSOFT_APP_ID, process.env.MICROSOFT_APP_PASSWORD);
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
        console.log('Mesage from' + address);
        var recipient = builder.EntityRecognizer.findEntity(args.entities, 'recipient');
        var appreciationVerb = builder.EntityRecognizer.findEntity(args.entities, 'appreciationVerb');
        var reason = builder.EntityRecognizer.findEntity(args.entities, 'reason');

        console.log(JSON.stringify(args.entities));

        if (!recipient) {
            builder.Prompts.text(session, "Who would you like to thank?");
        } else if (!appreciationVerb) {
            builder.Prompts.text(session, "How would you like to show your appreciation?  example: say thanks, thank, give a high five, recognize, etc...");
        } else if (!reason) {
            builder.Prompts.text(session, "Why are you thankful?");
        } else {
            next({
                recipient: recipient.entity,
                appreciationVerb: appreciationVerb.entity,
                reason: reason.entity
            });
        }
    },
    function(session, thankYouMessage) {

        console.log(JSON.stringify(thankYouMessage));
        session.sendTyping();
        session.send("Ok...%s to %s for %s.", thankYouMessage.appreciationVerb, thankYouMessage.recipient, thankYouMessage.reason);
    }
]);

intents.matches('help',
    function(session, results) {
        session.send("Thank you bot is an easy and fun way to say thanks.  For example, say:\nThanks mom for making my lunch!", results);
    }
);