const express = require('express'); 
const app = express();
const http = require('http')
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  console.log('client connected');
  socket.on('chat', (message) => {
    io.emit('chat', {message, id: socket.id});
  });
});

server.listen(3000, () => {
  console.log('listening on: ', 3000);
});
