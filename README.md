# Thank You Bot

Thank You Bot is based on the Microsoft Bot Framework and uses Microsoft LUIS service for natural language understanding.

For more information on the framework, see: 

Bot Builder for Node.js
[Bot Builder for Node.js](http://docs.botframework.com/builder/node/overview/) is a powerful framework for constructing bots that can handle both freeform interactions and more guided ones where the possibilities are explicitly shown to the user. It is easy to use and models frameworks like Express & Restify to provide developers with a familiar way to write Bots.


Local Testing: 

Start mongodb:

mongod --dbpath=/data/db

Mongo Shell:

mongo
use thankyoubot
show collections

# Insert sample document
db.thankyou.save({
    appreciationVerb: 'Thank You',
    recipient: 'Gabe',
    reason: 'for always making me laugh!'
})

# show the doc
db.thankyou.find().pretty()

Debugging:

Detailed debugging instructions when using Visual Studio Code can be found at:

https://docs.botframework.com/en-us/node/builder/guides/debug-locally-with-vscode/#navtitle

Command:

node --debug-brk app.js

then start the debugger and attach to process.