var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const client = require('redis').createClient();

client.subscribe('pubsub', (err, channel) => {
    console.log(channel + ' channel subscribed');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    client.on("message", (channel, message) => {
        var obj = JSON.parse(message);
        socket.emit('msg', obj.message);
    });
});

var PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('listening on : ' + PORT);
});
