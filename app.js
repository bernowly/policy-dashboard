var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const redis = require('redis');
const client = redis.createClient();
const subscribe = redis.createClient();

subscribe.subscribe('pubsub', function(channel, count) {
    console.log(count  + 'channel(s) subscribed');
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    subscribe.on("message", function(channel, message) {
        var obj = JSON.parse(message);
        socket.emit('msg', obj.message);
    });
});

var PORT = process.env.PORT || 3000;
http.listen(PORT, function() {
    console.log('listening on : ' + PORT);
});
