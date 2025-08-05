const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let emotion = 'joy';

const colors = {
  joy: '#ffd700',
  rage: '#ff3300',
  sorrow: '#3366ff',
  curiosity: '#cc33ff',
  serenity: '#33cc99'
};

const tileSize = 60;
const cols = Math.floor(canvas.width / tileSize);
const rows = Math.floor(canvas.height / tileSize);
const terrainGrid = [];

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    terrainGrid.push({
      x: x * tileSize,
      y: y * tileSize,
      color: colors[emotion]
    });
  }
}

let avatar = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  color: colors[emotion]
};

function drawTerrain() {
  terrainGrid.forEach(tile => {
    ctx.fillStyle = tile.color;
    ctx.fillRect(tile.x, tile.y, tileSize - 2, tileSize - 2);
  });
}

function drawAvatar() {
  ctx.beginPath();
  ctx.arc(avatar.x, avatar.y, avatar.size, 0, Math.PI * 2);
  ctx.fillStyle = avatar.color;
  ctx.shadowColor = avatar.color;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function updateEmotion(newEmotion) {
  emotion = newEmotion;
  terrainGrid.forEach(tile => tile.color = colors[emotion]);
  avatar.color = colors[emotion];
}

document.addEventListener('keydown', e => {
  if (e.key === '1') updateEmotion('joy');
  if (e.key === '2') updateEmotion('rage');
  if (e.key === '3') updateEmotion('sorrow');
  if (e.key === '4') updateEmotion('curiosity');
  if (e.key === '5') updateEmotion('serenity');

  if (e.key === 'ArrowUp') avatar.y -= 10;
  if (e.key === 'ArrowDown') avatar.y += 10;
  if (e.key === 'ArrowLeft') avatar.x -= 10;
  if (e.key === 'ArrowRight') avatar.x += 10;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTerrain();
  drawAvatar();
  requestAnimationFrame(animate);
}

animate();
