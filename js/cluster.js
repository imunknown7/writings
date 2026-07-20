const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let particles = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

window.addEventListener("resize", resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.vx = (Math.random() - 0.5) * 0.08;
    this.vy = (Math.random() - 0.5) * 0.08;

    this.radius = 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fill();
  }
}

for (let i = 0; i < 45; i++) {
  particles.push(new Particle());
}

function connect() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;

      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200) {
        ctx.beginPath();

        ctx.moveTo(particles[a].x, particles[a].y);

        ctx.lineTo(particles[b].x, particles[b].y);

        ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 170) * 0.25})`;

        ctx.lineWidth = 0.5;

        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  connect();

  requestAnimationFrame(animate);
}

animate();
