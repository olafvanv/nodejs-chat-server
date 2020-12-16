require('dotenv').config();

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
const port = process.env.PORT || 3000;

app.get('/', (req, res,next) => {
  res.send('Hello');
});

io.on('connection', socket => {
  console.log('client connected');
  socket.on('chat', (message) => {
    io.emit('chat', {message, id: socket.id});
  });
});

server.listen(port, () => {
  console.log('listening on: ', port);
});
