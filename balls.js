const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let raf = window.requestAnimationFrame(draw);

const COLLISION = .9;
const GRAVITY = .25;

class Ball {
  constructor(x, y) {
    this.radius = 10;
    this.color = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
    this.x = Math.min(Math.max(x, this.radius), canvas.width - this.radius);
    this.y = Math.min(Math.max(y, this.radius), canvas.height - this.radius);
    this.vx = Math.random() * 20 - 10;
    this.vy = Math.random() * 20 - 10;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let balls = [];

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clear();
  balls = balls.filter((ball) => {
    ball.draw();

    // tentative new y
    const y1 = ball.y + ball.vy + GRAVITY / 2;
    if (y1 + ball.radius > canvas.height || y1 - ball.radius < 0) {
      // what the ball is bouncing against
      const wall = y1 - ball.radius > 0 ? canvas.height - ball.radius : ball.radius;
      const dist = wall - ball.y;

      // velocity when it reached the floor/ceiling
      const v1 = Math.sign(y1 - wall) * Math.sqrt(ball.vy * ball.vy + 2 * GRAVITY * dist);
      // velocity after it bounced
      const v2 = -v1 * COLLISION;
      // time to reach floor/ceiling
      const t1 = (v1 - ball.vy) / GRAVITY;
      // remaining time
      const t2 = 1 - t1;
      // final velocity
      ball.vy = v2 + GRAVITY * t2;
      // final position
      ball.y = wall + (v2 + ball.vy) / 2 * t2;
      if (canvas.height - ball.y < ball.radius) {
        // the velocity is so low that gravity wins again, just remove it
        return false;
      }
    } else {
      ball.y = y1;
      ball.vy += GRAVITY;
    }

    // tentative new x
    const x1 = ball.x + ball.vx;
    if (x1 + ball.radius > canvas.width || x1 - ball.radius < 0) {
      // what the ball is bouncing against
      const wall = x1 - ball.radius > 0 ? canvas.width - ball.radius : ball.radius;
      const dist = wall - ball.x;
      ball.x = wall + COLLISION * (dist - ball.vx);
      ball.vx = -ball.vx * COLLISION;
    } else {
      ball.x = x1;
    }

    return true;
  });

  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener('click', function(e) {
  balls.push(new Ball(e.clientX, e.clientY));
});
