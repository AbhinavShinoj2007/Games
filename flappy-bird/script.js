const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Bird properties
let birdX = 50;
let birdY = 150;
let birdWidth = 30;
let birdHeight = 30;
let gravity = 0.6;
let lift = -10;
let velocity = 0;

// Pipes
let pipes = [];
let pipeWidth = 60;
let pipeGap = 140;
let frame = 0;
let score = 0;

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});
document.addEventListener("click", flap);

function flap() {
  velocity = lift;
}

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird physics
  velocity += gravity;
  birdY += velocity;
  ctx.fillStyle = "yellow";
  ctx.fillRect(birdX, birdY, birdWidth, birdHeight);

  // Add new pipes
  if (frame % 90 === 0) {
    let pipeTop = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({ x: canvas.width, top: pipeTop });
  }

  // Draw and move pipes
  pipes.forEach((pipe, index) => {
    pipe.x -= 3;
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
    }
  });

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

  // Ground/ceiling collision
  if (birdY + birdHeight > canvas.height || birdY < 0) {
    gameOver();
  }

  // Score display
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  frame++;
  requestAnimationFrame(update);
}

function gameOver() {
  alert("Game Over! Final Score: " + score);
  document.location.reload();
}

update();
