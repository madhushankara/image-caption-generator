const canvas = document.createElement("canvas");
canvas.id = "canvas-club";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);

const maxParticles = 60;
const particles = [];
let hue = 183;
let colorPaused = false;

// Mouse tracking
const mouse = { x: null, y: null };

// Helper function to generate random numbers
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Particle object
function Particle() {
    this.init();
}



Particle.prototype = {
    init: function () {
        this.x = mouse.x || w / 2;
        this.y = mouse.y || h / 2;
        this.size = random(5, 30);
        this.vx = random(-3, 3);
        this.vy = random(-5, 5);
        this.life = 0;
        this.maxLife = random(50, 150);
    },
    draw: function () {
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, .8)`;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, .5)`;
        ctx.lineWidth = this.size / 20;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.update();
    },
    update: function () {
        if (this.life > this.maxLife || this.size < 0.1) {
            this.init();
        } else {
            if (this.y + this.size >= h || this.y - this.size <= 0) this.vy *= -1;
            if (this.x + this.size >= w || this.x - this.size <= 0) this.vx *= -1;

            this.x += this.vx * 0.99;
            this.y += this.vy * 0.99;
            this.size *= 0.99;
            this.life++;
        }
    }
};

// Event Listeners
function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);

document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

canvas.addEventListener("click", () => {
    colorPaused = !colorPaused;
});

// Initialize particles
function setupParticles() {
    for (let i = 0; i < maxParticles; i++) {
        setTimeout(() => {
            const particle = new Particle();
            particles.push(particle);
        }, i * 20);
    }
}

// Animation loop
function animateParticles() {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0,0,0,.3)";
    ctx.fillRect(0, 0, w, h);

    particles.forEach((particle) => particle.draw());

    if (!colorPaused) hue += 0.5;

    requestAnimationFrame(animateParticles);
}

setupParticles();
animateParticles();