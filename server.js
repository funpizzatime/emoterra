
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Sentiment = require('sentiment');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const sentiment = new Sentiment();

const players = {};

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  players[socket.id] = {
    x: Math.random() * 800,
    y: Math.random() * 600,
    color: '#999999',
  };

  socket.emit('init', { id: socket.id, players });
  socket.broadcast.emit('update', { players });

  socket.on('move', (dir) => {
    const p = players[socket.id];
    if (!p) return;
    if (dir.up) p.y -= 10;
    if (dir.down) p.y += 10;
    if (dir.left) p.x -= 10;
    if (dir.right) p.x += 10;
    io.emit('update', { players });
  });

  socket.on('chat', (message) => {
    const p = players[socket.id];
    if (!p) return;

    const result = sentiment.analyze(message);
    let emotion = 'neutral';
    if (result.score > 1) emotion = 'positive';
    else if (result.score < -1) emotion = 'negative';

    p.color = emotion === 'positive' ? '#ffd700' :
              emotion === 'negative' ? '#ff3300' :
              emotion === 'neutral' ? '#3366ff' : '#999999';

    io.emit('chat', { id: socket.id, message, emotion });
    io.emit('update', { players });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
    delete players[socket.id];
    io.emit('update', { players });
  });
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Emoterra server running on port', PORT);
});
