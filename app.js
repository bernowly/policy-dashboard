var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
const client = require('redis').createClient();
const redis = require('redis').createClient();

client.subscribe('pubsub', (err, channel) => {
    console.log(channel + ' channel subscribed');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    client.on("message", (channel, message) => {
        var obj = JSON.parse(message);
        processProduct(obj, socket);
    });
});

function processProduct(obj, socket) {
  redis.hmset('monit:rec:' + obj.id + '@' + obj.product, obj, (err, resp) => {
      socket.emit('clean', obj.product);
      redis.expire('monit:rec:' + obj.id + '@' + obj.product, 10, redis.print);
      redis.keys('monit:rec:*@' + obj.product, (err, data) => {
          data.forEach((key) => {
              redis.hgetall(key, (err, item) => {
                  socket.emit(obj.product, item);
              });
          });
      });
  });
}

var PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('listening on : ' + PORT);
});
