var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
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
        if (obj.product == 'home') {
            socket.emit('home', obj);
        }
        if (obj.product == 'auto') {
            socket.emit('auto', obj);
        }
        if (obj.product == 'life') {
            socket.emit('life', obj);
        }

    });
});

var PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('listening on : ' + PORT);
});
