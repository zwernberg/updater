var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const axios = require('axios');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
	console.log('message:' + msg);
  });
  socket.on('message', function(msg){
    console.log(msg);
    io.emit('message', msg);
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

