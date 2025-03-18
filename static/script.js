// Pop ups
function openPopup(id) {
    const popup = document.getElementById(id);
    if (!popup) return;

    popup.style.display = "flex";

    // Prevent scrolling of the main content but allow scrolling inside the popup
    document.documentElement.style.overflow = "hidden"; 
    document.body.style.overflow = "hidden";

    // Get the first element inside the popup with .popup-content
    const popupContent = popup.querySelector(".popup-content"); 

    if (popupContent) {
        // Ensure popup can be scrolled on mobile
        popupContent.style.overflowY = "auto";  
        popupContent.style.maxHeight = "90vh"; // Prevent it from being too large

        // Delay scrolling slightly to ensure the popup is fully rendered
        setTimeout(() => {
            popupContent.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
    }
}

// Close the popup and restore scrolling
function closePopup(id) {
    const popup = document.getElementById(id);

    if (!popup) return;

    popup.style.display = "none";

    // Allow scrolling again
    document.body.style.overflow = "";
}

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
    let rocketResponsiveFactor = 0.7 + (canvas.width / 6000);

    function reportWindowSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        rocketResponsiveFactor = 0.8 + (canvas.width / 10000);

        const popups = document.querySelectorAll(".project-popup");
        popups.forEach(popup => {
            if (popup.style.display === "flex") {
                popup.style.alignItems = "center";
                popup.style.justifyContent = "center";
            }
        });
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
        ctx.drawImage(rocketImg, -rocket.size / 2 * rocketResponsiveFactor, -rocket.size / 2 * rocketResponsiveFactor, rocket.size * rocketResponsiveFactor, rocket.size * rocketResponsiveFactor);
        ctx.restore();
    }

    function drawTrail() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        rocket.trail.forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 3.75 * rocketResponsiveFactor, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function updateRocket(deltaTime) {
        rocketSize = canvas.width / 15;

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

    const canvas2 = document.getElementById("starsCanvas");
    const ctx2 = canvas2.getContext("2d");

    function resizeCanvas() {
        canvas2.width = window.innerWidth;
        canvas2.height = document.querySelector(".intro").offsetHeight;
        generateStars();
    }

    let stars = [];
    //const numStars = 100;

    function generateStars() {
        let numStars = Math.floor((canvas2.width * canvas2.height) / 15500);
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas2.width,
                y: Math.random() * canvas2.height,
                baseX: 0, // Posición base para oscilación
                baseY: 0,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.2 + 0.05, // Velocidad sutil de movimiento
                angle: Math.random() * Math.PI * 2 // Ángulo de oscilación inicial
            });
        }
    }

    let mouseX = 0, mouseY = 0;

    function drawStars() {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.fillStyle = "white";
        stars.forEach(star => {
            star.angle += star.speed * 0.1; // Movimiento lento
            star.baseX = Math.cos(star.angle) * 2; // Oscilación horizontal
            star.baseY = Math.sin(star.angle) * 2; // Oscilación vertical

            let parallaxX = ((mouseX * 0.12) - window.innerWidth / 2) * (star.radius * 0.02);
            let parallaxY = ((mouseY * 0.12) - window.innerHeight / 2) * (star.radius * 0.02);

            ctx2.globalAlpha = star.opacity;
            ctx2.beginPath();
            ctx2.arc(
                star.x + star.baseX + parallaxX,
                star.y + star.baseY + parallaxY,
                star.radius,
                0,
                Math.PI * 2
            );
            ctx2.fill();
            ctx2.closePath();
        });
    }

    function animateStars() {
        drawStars();
        requestAnimationFrame(animateStars);
    }

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    resizeCanvas();
    animateStars();
    window.addEventListener("resize", resizeCanvas);

});