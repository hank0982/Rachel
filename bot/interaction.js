var restify = require('restify');
var builder = require('botbuilder');

var connector = new builder.ChatConnector();

var bot = new builder.UniversalBot(connector)

var dialog = new builder.IntentDialog();

dialog.matches('Calendar', [

])

dialog.matches('Todo', [

]);

dialog.matches(/^Attention/, [
    function(session, args, next) {
        var entity = session.message.text.substring(10);
        next({response: entity});
    },

    function(session, result, next) {
        var entity = result.response;
        session.send('OK! I will reminder you %s later.', entity);
    }
]);

dialog.onDefault(builder.DialogAction.send("Sorry, I don't understand."));

bot.dialog('/', dialog);

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log("%s listening to %s", server.name, server.url);
});

server.post('/api/messages', connector.listen());