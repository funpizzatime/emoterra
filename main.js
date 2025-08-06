const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let players = {};
let myId = null;
let emotionColor = '#ffd700';

const socket = io();

socket.on('init', data => {
  myId = data.id;
  players = data.players;
});

socket.on('update', data => {
  players = data.players;
});

socket.on('chat', ({ id, message, emotion }) => {
  const msgDiv = document.getElementById('messages');
  const div = document.createElement('div');
  div.textContent = `${id.slice(0, 4)}: ${message}`;
  msgDiv.appendChild(div);
  msgDiv.scrollTop = msgDiv.scrollHeight;

  if (id === myId) {
    emotionColor = emotion === 'positive' ? '#ffd700' :
                   emotion === 'negative' ? '#ff3300' :
                   emotion === 'neutral' ? '#3366ff' : '#999999';
  }
});

document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const input = e.target;
    const text = input.value.trim();
    if (text.length > 0) {
      socket.emit('chat', text);
      input.value = '';
    }
  }
});

document.addEventListener('keydown', e => {
  const move = { up: false, down: false, left: false, right: false };
  if (e.key === 'ArrowUp') move.up = true;
  if (e.key === 'ArrowDown') move.down = true;
  if (e.key === 'ArrowLeft') move.left = true;
  if (e.key === 'ArrowRight') move.right = true;
  socket.emit('move', move);
});

function drawPlayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const id in players) {
    const p = players[id];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  requestAnimationFrame(drawPlayers);
}
drawPlayers();
