document.addEventListener("DOMContentLoaded", function() {
    const viewProjectsBtn = document.getElementById("view-projects");
    const projectsSection = document.getElementById("projects");
    const body = document.body;

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

    document.body.addEventListener('scroll',()=>{
    if(document.documentElement.scrollTop || document.body.scrollTop <= 0){
        lockScroll();
    }});


    // ROCKET
    const canvas = document.getElementById("rocketCanvas");
    const ctx = canvas.getContext("2d");

    let angle = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let rocketImg = new Image();
    rocketImg.src = "../static/Rocket.png"; // Adjust path if needed

    let rocket = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        speed: 4, // Movement speed
        size: 60, // Bigger rocket
        angle: 0, // Rotation angle
        dx: Math.cos(0) * 3, // Initial movement X
        dy: Math.sin(0) * 3, // Initial movement Y
        trail: []
    };

    function drawRocket() {
        ctx.save();
        ctx.translate(rocket.x, rocket.y);
        ctx.rotate(rocket.angle + Math.PI/2); // Use calculated angle
        ctx.drawImage(rocketImg, -rocket.size / 2, -rocket.size / 2, rocket.size, rocket.size);
        ctx.restore();
    }

    function drawTrail() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        rocket.trail.forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function updateRocket() {
        // Create wavy motion with circular pattern
        //let waveFactor = Math.sin(performance.now() * 0.002) * 2;
        angle += getRandom(0, 0.006);
        rocket.dx = Math.cos(angle) * rocket.speed;
        rocket.dy = Math.sin(angle * 1.5) * rocket.speed;

        // Update position
        rocket.x += rocket.dx;
        rocket.y += rocket.dy;

        // Update rotation based on velocity vector
        rocket.angle = Math.atan2(rocket.dy, rocket.dx);

        // Keep rocket inside canvas (wrap around)
        if (rocket.x < 0) rocket.x = canvas.width;
        if (rocket.x > canvas.width) rocket.x = 0;
        if (rocket.y < 0) rocket.y = canvas.height;
        if (rocket.y > canvas.height) rocket.y = 0;

        // Add new trail position
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 125) rocket.trail.shift();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTrail();
        drawRocket();
        updateRocket();
        requestAnimationFrame(animate);
    }

    rocketImg.onload = () => animate(); // Start animation once image loads
});