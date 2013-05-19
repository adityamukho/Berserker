var events = require('events');

var eventEmitter = new events.EventEmitter(),
        util = {},
        traverse = function traverse(obj, callback) {
    if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++) {
            if (typeof obj[i] === "object" && obj[i]) {
                callback(obj, i);
                traverse(obj[i], callback);
            } else {
                callback(obj, i, obj[i])
            }
        }
    } else {
        for (var prop in obj) {
            if (typeof obj[prop] === "object" && obj[prop]) {
                callback(obj, prop);
                traverse(obj[prop], callback);
            } else {
                callback(obj, prop, obj[prop]);
            }
        }
    }
};

exports.traverse = traverse;
exports.eventEmitter = eventEmitter;