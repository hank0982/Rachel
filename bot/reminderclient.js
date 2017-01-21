var querystring = require('querystring');
var request = require('request');

module.exports = {
    createUser: function (username, callback) {
        request.post({
            url: '',
            formData: {
                username: username
            }
        }, callback);
    },

    addAttention: function (person, attention, callback) {
        request.post({
            url: '',
            formData: {
                person: person,
                attention: attention
            }
        }, callback);
    },

    addCalendar: function(content, startTime, endTime, callback) {
        request.post({
            url: '',
            formData: {
                content: content,
                startTime: startTime,
                endTime, endTime
            }
        }, callback);
    },

    addTodo: function(content, endTime, callback) {
        request.post({
            url: '',
            formData: {
                content: content,
                endTime, endTime
            }
        }, callback);
    },

}
