var restify = require('restify');
var client = require('./reminderclient.js');
var builder = require('botbuilder');

var connector = new builder.ChatConnector();

var bot = new builder.UniversalBot(connector)


var APP_ID = '207badd4-557c-44fe-8e5d-cc2e7f1220d3';
var SUB_KEY = '4cadea2300cc4a65a54edb454e670f4c';
//const LuisModelUrl = 'https://api.projectoxford.ai/luis/v1/application?id=' + APP_ID + '&subscription-key=' + SUB_KEY ;
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/' + APP_ID + '?subscription-key=' + SUB_KEY + '&verbose=true';
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var dialog = new builder.IntentDialog({recognizers: [recognizer]});

function calendarEntity(session, args, next) {
    var entities = {};
    if (args) {
        entities = args.entities;
    }
    
    var event = {};
    for(var entity in entities) {
        if(entity.type == 'Info') {
            event.info = entity.entity
        }

    }
}

function attentionEntity(session, args, next) {
    var entities = {};
    console.log(args);
    if (args) {
        entities = args.entities;
    }
    
    var event = {};
    for(var entity of entities) {
        if(entity.type == 'Info') {
            event.info = entity.entity;
        }

        if(entity.type == 'disease') {
            event.disease = entity.entity;
        }

        if(entity.type == 'people') {
            event.people = entity.entity;
        }

        if(event.type == 'verb') {
            event.verb = entity.entity;
        }

        if(event.type == 'object') {
            event.object = entity.entity;
        }
    }

    console.log(event);
    if (event.disease) {
        //call disease api
        if(!event.people) {
            session.send('who are you talking about?')
            //event.people = session.
        }
        session.send('It is disease');
    } else {
        //call attention api
        session.send('It is attention');
    }
    next({info: event.info})
}

function calendarEnding(session, results, next) {
    session.send('Add %s to calendar', results.info);
}

function todoEnding(session, results, next) {
    session.send('Add %s to todo list', results.info);
}

function attentionEnding(session, results, next) {
    session.send('OK, I will remind you %s later', results.info);
}

dialog.matches("Calendar", [
    function(session, args, next) {
       // console.log(args);
       // if(args){
       //     client.addCalendar(args.content, args.startTime, args.endTime, function () {
       //         session.send('Add %s to calendar', session.message.text);
       //     });
       // }else {
       //     session.send('It is calendar event.');
       // }
       session.send('It is a calendar event');
       next();
    },
    calendarEnding
])

dialog.matches("Todo", [
   // function(session, args, next) {
   //     console.log(args);
   //     var todo = session.message.text;
   //     next({response: todo});
   // },

   // function(session, result, next) {
   //     var todo = result.response;
   //     session.send('OK! Add %s to TODO list.', todo);
   // }
   function(session, args, next) {
       session.send('It is todo event');
       next();
   },
   todoEnding
]);

dialog.matches("Attention", [
   // function(session, args, next) {
   //     console.log(args);
   //     var entity = session.message.text;
   //     next({response: entity});
   // },

   // function(session, result, next) {
   //     var entity = result.response;
   //     session.send('OK! I will remind you %s later.', entity);
   // }
  // function(session, result, next) {
  //     session.send('It is attention event');
  //     next();
  // },
   attentionEntity,
   attentionEnding
]);

dialog.matches('Greeting', function(session, args, next) {
    session.beginDialog('/choice');
});


bot.dialog('/', dialog);
bot.dialog('/choice', [
    function(session, args, next) {
        builder.Prompts.choice(session, 'How may I help you?', ['Calendar', 'Todo', 'Attention']);
    },
    function(session, results) {
        if (results.response) {
            //session.beginDialog()
        }
    }]
);

dialog.onDefault(function(session, args, next){ 
    session.send('Sorry, I do not understand');
    session.beginDialog('/choice');
});

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log("%s listening to %s", server.name, server.url);
});

server.post('/api/messages', connector.listen());