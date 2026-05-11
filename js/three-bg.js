/* 
    CYBERPORTFOLIO 2026 - THREE.JS BACKGROUND
    Particle Network / Neural Web
*/

const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let particles;
const particleCount = 1500;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

function initThree() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.z = 5;

    // Create Particles
    const geometry = new THREE.BufferGeometry();
    
    for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

        // Color (Mix of neon blue and purple)
        const mixedColor = new THREE.Color();
        const lerpVal = Math.random();
        mixedColor.lerpColors(new THREE.Color(0x00f3ff), new THREE.Color(0xbc13fe), lerpVal);
        
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    // Subtle floating movement
    const time = Date.now() * 0.0001;
    particles.position.y = Math.sin(time) * 0.1;

    renderer.render(scene, camera);
}

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    gsap.to(particles.rotation, {
        x: mouseY * 0.2,
        y: mouseX * 0.2,
        duration: 2,
        ease: "power2.out"
    });
});

initThree();