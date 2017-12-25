var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const axios = require('axios');

var messages = [];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  // socket.emit('start_messages', messages)
  console.log('user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
	console.log('message:' + msg);
  });
  socket.on('message', function(msg){
    console.log(msg);
    axios.post('http://schumacher.football/api/messages/', {
      name: msg.name,
      message: msg.message
    })
    .then(response => {
      socket.emit('message', response.data);
    })
  });
  setInterval(function() {
    if (io.engine.clientsCount > 0) {
      axios.get('http://schumacher.football/api/championship/')
        .then(response => {
          socket.emit('update', response.data)
        })
    }
  }, 1000 * 60);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

