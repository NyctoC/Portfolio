document.addEventListener("DOMContentLoaded", function () {
    const viewProjectsBtn = document.getElementById("view-projects");
    const projectsSection = document.getElementById("projects");
    const body = document.body;

    document.querySelectorAll(".project-card").forEach(card => {
        const bgImage = card.getAttribute("data-bg");
        if (bgImage) {
            card.style.setProperty("--bg-image", `url('images/${bgImage}')`);
        }
    });

    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
    }

    function unlockScroll() {
        body.classList.add("scrolling");
        document.body.scrollTop = projectsSection.offsetTop;
    }

    function lockScroll() {
        body.classList.remove("scrolling");
        console.log("LockScroll");
    }

    viewProjectsBtn.addEventListener("click", unlockScroll);

    document.body.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop || document.body.scrollTop <= 0) {
            lockScroll();
        }
    });


    // ROCKET
    const canvas = document.getElementById("rocketCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let rocketImg = new Image();
    
    function reportWindowSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.onresize = reportWindowSize;

    rocketImg.src = "../static/Images/Rocket.png"; // Adjust path if needed

    let angle = 0;
    let lastTime = performance.now(); // Track last frame time

    let rocket = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        speed: 200, // Pixels per second (frame-rate independent)
        size: 60, // Bigger rocket
        angle: 0, // Rotation angle
        dx: Math.cos(0) * 3,
        dy: Math.sin(0) * 3,
        trail: []
    };

    function drawRocket() {
        ctx.save();
        ctx.translate(rocket.x, rocket.y);
        ctx.rotate(rocket.angle + Math.PI / 2);
        ctx.drawImage(rocketImg, -rocket.size / 2, -rocket.size / 2, rocket.size, rocket.size);
        ctx.restore();
    }

    function drawTrail() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        rocket.trail.forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 3.75, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function updateRocket(deltaTime) {
        angle += getRandom(0, 0.006);

        let distance = (rocket.speed * deltaTime) / 1000; // Scale movement by time
        rocket.dx = Math.cos(angle) * distance;
        rocket.dy = Math.sin(angle * 1.5) * distance;

        rocket.x += rocket.dx;
        rocket.y += rocket.dy;

        // Update rotation
        rocket.angle = Math.atan2(rocket.dy, rocket.dx);

        // Keep inside canvas
        if (rocket.x < 0) rocket.x = canvas.width;
        if (rocket.x > canvas.width) rocket.x = 0;
        if (rocket.y < 0) rocket.y = canvas.height;
        if (rocket.y > canvas.height) rocket.y = 0;

        // Trail effect
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 125) rocket.trail.shift();
    }

    function animate(currentTime) {
        let deltaTime = currentTime - lastTime; // Time since last frame
        lastTime = currentTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTrail();
        drawRocket();
        updateRocket(deltaTime);

        requestAnimationFrame(animate);
    }

    rocketImg.onload = () => requestAnimationFrame(animate);

});