// Selecting the ball counter element
const counter = document.querySelector("p");

// Selecting the game over text element
const gameover = document.querySelector(".gameover");

// Set the total number of balls to be generated
let numTotalBalls = 25;

// Set up the canvas and context for drawing
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Set the canvas size to the window's width and height
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Base Shape Class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x; // X coordinate
    this.y = y; // Y coordinate
    this.velX = velX; // Horizontal velocity
    this.velY = velY; // Vertical velocity
  }
}
// Ball derives from shape
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    // Passing in parameters to super()
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    // Tracks whether or not ball eaten by evilCircle
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
  // Method to update the ball's position and ensure it bounces within the canvas
  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }
  // Method to detect collisions between balls and change their colors
  collisionDetect() {
    for (const ball of balls) {
      // Check Collision only IF ball exists
      if (!(this === ball) && this.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// Evil Circle Player Controlled class derives from Shape
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "rgb(255, 36, 0)";
    this.size = 20;
    this.exists = true;
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }
  // Method to draw the evil circle on the canvas
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 3;
  }
  // Method to ensure the evil circle stays within the canvas bounds
  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }

    if (this.x - this.size <= 0) {
      this.x += this.size;
    }

    if (this.y + this.size >= height) {
      this.y -= this.size;
    }

    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }
  //Method to detect collisions with balls and make them disappear
  collisionDetect() {
    for (const ball of balls) {
      // For all balls that exist check Collision only IF ball exists
      if (this.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // What happens when evilCircle collides with a Ball
        if (distance < this.size + ball.size) {
          ball.exists = false; // Ball disappears when collided with evil circle
        }
      }
    }
  }
}

// Array to hold all ball objects
const balls = [];

// Generate a number of balls and store them in the balls array
while (balls.length < numTotalBalls) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}
// Evil Circle Declaration
const evilCircle = new EvilCircle(width / 2, height / 2);

// Main game loop function
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  let ballsLeft = 0;
  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
      ballsLeft++; // Increment the ball counter for existing balls
    }
    counter.textContent = "Ball Count: " + ballsLeft;
    // If no balls are left, show the game over message
    if (ballsLeft <= 0) {
      gameover.classList.remove("hidden");
    }
  }
  // Draw and update the evil circle
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();
  requestAnimationFrame(loop);
}

loop();
