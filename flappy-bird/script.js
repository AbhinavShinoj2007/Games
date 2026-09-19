const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');

const WORLD_WIDTH = canvas.width;
const WORLD_HEIGHT = canvas.height;
const bird = { x: 105, y: 285, radius: 17 };
const gravity = 0.58;
const lift = -10;
const pipeWidth = 72;
const pipeGap = 170;
const pipeSpeed = 3.1;
let velocity = 0;
let pipes = [];
let frame = 0;
let score = 0;
let highScore = Number(localStorage.getItem('flappyHighScore') || 0);
let lastScore = Number(localStorage.getItem('flappyLastScore') || 0);
let gameRunning = false;
let animationFrame;
const stars = Array.from({ length: 60 }, () => ({ x: Math.random() * WORLD_WIDTH, y: Math.random() * WORLD_HEIGHT, r: Math.random() * 1.8 + 0.4, a: Math.random() * 0.7 + 0.3 }));

function updateHUD() {
  scoreDisplay.textContent = score;
  highScoreDisplay.textContent = highScore;
}

function flap() {
  if (!gameRunning) {
    startGame();
    return;
  }
  velocity = lift;
}

function startGame() {
  bird.y = 285;
  velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameRunning = true;
  overlay.classList.add('hidden');
  startBtn.innerHTML = 'Restart game <b>↻</b>';
  updateHUD();
  cancelAnimationFrame(animationFrame);
  update();
}

function update() {
  if (!gameRunning) return;
  drawBackground();
  velocity += gravity;
  bird.y += velocity;
  drawBird();

  if (frame % 112 === 0) {
    const top = Math.random() * (WORLD_HEIGHT - pipeGap - 190) + 70;
    pipes.push({ x: WORLD_WIDTH + 10, top, passed: false });
  }

  for (const pipe of pipes) {
    pipe.x -= pipeSpeed;
    drawPipe(pipe);

    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      pipe.passed = true;
      score += 1;
      updateHUD();
    }

    // Use a forgiving circular hitbox around the bird, but include the pipe caps.
    const overlapsX = bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth;
    const hitsPipe = bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.top + pipeGap;
    if (overlapsX && hitsPipe) {
      gameOver();
      return;
    }
  }

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > -10);
  if (bird.y + bird.radius >= WORLD_HEIGHT || bird.y - bird.radius <= 0) {
    gameOver();
    return;
  }

  frame += 1;
  animationFrame = requestAnimationFrame(update);
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
  gradient.addColorStop(0, '#202d67');
  gradient.addColorStop(1, '#52b8c1');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  stars.forEach(star => {
    ctx.globalAlpha = star.a;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(255,255,255,.12)';
  ctx.beginPath();
  ctx.arc(85, 135, 70, 0, Math.PI * 2);
  ctx.arc(475, 210, 100, 0, Math.PI * 2);
  ctx.fill();
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 5, velocity / 12)));
  ctx.font = '36px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🐦', 0, 0);
  ctx.restore();
}

function drawPipe(pipe) {
  const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
  gradient.addColorStop(0, '#b7e85f');
  gradient.addColorStop(1, '#42a56c');
  ctx.fillStyle = gradient;
  ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
  ctx.fillRect(pipe.x - 6, pipe.top - 20, pipeWidth + 12, 20);
  ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, WORLD_HEIGHT);
  ctx.fillRect(pipe.x - 6, pipe.top + pipeGap, pipeWidth + 12, 20);
}

function gameOver() {
  if (!gameRunning) return;
  gameRunning = false;
  cancelAnimationFrame(animationFrame);
  lastScore = score;
  localStorage.setItem('flappyLastScore', String(lastScore));

  const isNewBest = score > highScore;
  if (isNewBest) {
    highScore = score;
    localStorage.setItem('flappyHighScore', String(highScore));
  }

  overlayTitle.textContent = isNewBest ? 'NEW BEST!' : 'GAME OVER';
  overlayText.textContent = `Score: ${score}  •  Best: ${highScore}`;
  overlay.classList.remove('hidden');
  startBtn.innerHTML = 'Play again <b>↻</b>';
  updateHUD();
}

canvas.addEventListener('pointerdown', event => {
  event.preventDefault();
  flap();
});
startBtn.addEventListener('click', startGame);
overlay.addEventListener('click', event => {
  if (event.target === overlay) flap();
});
document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    event.preventDefault();
    flap();
  }
});

updateHUD();
