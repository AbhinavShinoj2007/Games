const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Bird properties
let birdX = 50;
let birdY = 150;
let birdWidth = 30;
let birdHeight = 30;
let gravity = 2;
let lift = -30;
let velocity = 0;

// Pipes
let pipes = [];
let pipeWidth = 50;
let pipeGap = 120;
let frame = 0;
let score = 0;

// Controls
document.addEventListener("keydown", flap);
document.addEventListener("click", flap);

function flap() {
  velocity = lift;
}

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird
  velocity += gravity * 0.5;
  birdY += velocity;
  ctx.fillStyle = "yellow";
  ctx.fillRect(birdX, birdY, birdWidth, birdHeight);

  // Pipes
  if (frame % 90 === 0) {
    let pipeTop = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({ x: canvas.width, top: pipeTop });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 2;
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);

    // Collision detection
    if (
      birdX < pipe.x + pipeWidth &&
      birdX + birdWidth > pipe.x &&
      (birdY < pipe.top || birdY + birdHeight > pipe.top + pipeGap)
    ) {
      alert("Game Over! Score: " + score);
      document.location.reload();
    }

    // Score
    if (pipe.x + pipeWidth === birdX) {
      score++;
    }
  });

  // Ground/ceiling collision
  if (birdY + birdHeight > canvas.height || birdY < 0) {
    alert("Game Over! Score: " + score);
    document.location.reload();
  }

  // Score display
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  frame++;
  requestAnimationFrame(draw);
}

draw();
