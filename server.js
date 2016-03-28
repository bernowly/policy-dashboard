const redis = require('redis');
const client = redis.createClient();
const subscribe = redis.createClient();

subscribe.subscribe('pubsub', function(channel, count) {
    console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
});

subscribe.on("message", function(channel, message) {
    console.log('%s - %s', channel, message);
});
