const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

// Bird properties
let birdX = 50, birdY = 150;
let birdWidth = 30, birdHeight = 30;
let gravity = 0.6, lift = -10, velocity = 0;

// Pipes
let pipes = [];
let pipeWidth = 60, pipeGap = 140;
let frame = 0, score = 0;
let highScore = localStorage.getItem("flappyHighScore") || 0;
let gameRunning = false;

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space" && gameRunning) flap();
});
document.addEventListener("click", () => {
  if (gameRunning) flap();
});

function flap() {
  velocity = lift;
}

function startGame() {
  // Reset everything
  birdY = 150;
  velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameRunning = true;
  startBtn.style.display = "none";
  updateHUD();
  update();
}

function update() {
  if (!gameRunning) return;

  // Draw background with stars
  drawBackground();

  // Bird physics
  velocity += gravity;
  birdY += velocity;
  ctx.fillStyle = "yellow";
  ctx.fillRect(birdX, birdY, birdWidth, birdHeight);

  // Add new pipes
  if (frame % 100 === 0) {
    let pipeTop = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({ x: canvas.width, top: pipeTop });
  }

  // Draw and move pipes
  pipes.forEach(pipe => {
    pipe.x -= 2.5;
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);

    // Collision detection
    if (
      birdX < pipe.x + pipeWidth &&
      birdX + birdWidth > pipe.x &&
      (birdY < pipe.top || birdY + birdHeight > pipe.top + pipeGap)
    ) {
      gameOver();
    }

    // Score when bird passes pipe
    if (pipe.x + pipeWidth === birdX) {
      score++;
      updateHUD();
    }
  });

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

  // Ground/ceiling collision
  if (birdY + birdHeight > canvas.height || birdY < 0) {
    gameOver();
  }

  frame++;
  requestAnimationFrame(update);
}

function drawBackground() {
  // Neon gradient background
  ctx.fillStyle = "#0f2027";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 30; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }
}

function gameOver() {
  gameRunning = false;

  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("flappyHighScore", highScore);
    alert("🎉 New High Score: " + highScore);
  } else {
    alert("Game Over! Score: " + score);
  }

  updateHUD();
  startBtn.style.display = "inline-block";
}

function updateHUD() {
  scoreDisplay.textContent = "Score: " + score;
  highScoreDisplay.textContent = "High Score: " + highScore;
}

// Attach start button
startBtn.addEventListener("click", startGame);

// Initialize HUD
updateHUD();
