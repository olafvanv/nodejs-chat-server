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
let totals = [];
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
    if (totals.length) totals.splice(i, 1);
  });

  socket.on('start-game', () => {
    started = true;
    players.forEach(p => totals.push(null));
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

  socket.on('end-game', (points) => {
    const i = players.indexOf(socket);
    totals[i] = points;

    // Check if all players have submitted their end scores
    // Returns true when a players still is playing
    if (totals.some(t => t === null)) {
      current_player = current_player === (players.length - 1) ? 0 : ++current_player;
      players[current_player].emit('your-turn', {});
    }
    // All players have submitted an end score, game ends
    else {
      const iHighestScore = totals.indexOf(Math.max(...totals));
      players.forEach(p => {
        console.log(p.id);
        if (p === players[iHighestScore]) { 
          p.emit('end-game', { winner: true, totals: totals })
        }
        else { 
          p.emit('end-game', { winner: false, totals: totals }) 
        }
      });
      totals = [];
      started = false;
    }
  });

});

server.listen(port, () => {
  console.log('listening on: ', port);
});