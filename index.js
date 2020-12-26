const express = require('express')
const app = express();
// const path = require('path');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ['https://ngx-yahtzee.netlify.app', 'http://localhost:4200'],
    methods: ['GET', 'POST']
  }
});
const port = process.env.PORT || 3000;

// app.use(express.static( path.join(__dirname, '/app')))
app.get('/', function (req, res) {
  res.send('<h1>Socket IO project</h1>');
});

const players = [];
let current_player = 0;
let started = false;

io.on('connection', socket => {
  if (started) return;

  players.push(socket);
  socket.join("game");

  io.in("game").emit('player-joined', players.length);

  socket.on('disconnect', () => {
    const i = players.indexOf(socket);
    players.splice(i, 1);
    io.in("game").emit('player-left', players.length);
    if (!players.length) started = false;
  });

  socket.on('start-game', () => {
    started = true;
    io.in("game").emit('start-game', {});
    players[0].emit('your-turn', {});
  });

  socket.on('dice-throw', (d) => {
    socket.to("game").emit("dice-throw", d);
  });

  socket.on('end-turn', () => {
    current_player = current_player === (players.length - 1) ? 0 : ++current_player;
    players[current_player].emit('your-turn', {});
  });

  socket.on('end-game', () => {
    started = false;
  });

});

server.listen(port, () => {
  console.log('listening on: ', port);
});
