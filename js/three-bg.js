/* 
    CYBERPORTFOLIO 2026 - THREE.JS BACKGROUND
    Neural Network / Web Effect
*/

const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let group;
const particlesCount = 200;
const maxDistance = 2.5;

function initThree() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.z = 10;

    group = new THREE.Group();
    scene.add(group);

    const helper = new THREE.BoxHelper(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20)));
    helper.material.opacity = 0;
    helper.material.transparent = true;
    group.add(helper);

    const segments = particlesCount * particlesCount;
    const positions = new Float32Array(segments * 3);
    const colors = new Float32Array(segments * 3);

    const pMaterial = new THREE.PointsMaterial({
        color: 0x00f3ff,
        size: 0.1,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: true
    });

    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        const x = Math.random() * 20 - 10;
        const y = Math.random() * 20 - 10;
        const z = Math.random() * 20 - 10;

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        // Add velocity for movement
        group.userData = group.userData || { particles: [] };
        group.userData.particles.push({
            velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2),
            numConnections: 0
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage));
    const pointCloud = new THREE.Points(particlesGeometry, pMaterial);
    group.add(pointCloud);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(linesMesh);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    const vertexpos = group.children[1].geometry.attributes.position.array;
    const linepos = group.children[2].geometry.attributes.position.array;
    const linecol = group.children[2].geometry.attributes.color.array;

    let vertexposIndex = 0;
    let colorposIndex = 0;
    let numConnected = 0;

    for (let i = 0; i < particlesCount; i++) {
        const particleData = group.userData.particles[i];

        vertexpos[i * 3] += particleData.velocity.x * 0.01;
        vertexpos[i * 3 + 1] += particleData.velocity.y * 0.01;
        vertexpos[i * 3 + 2] += particleData.velocity.z * 0.01;

        if (vertexpos[i * 3 + 1] < -10 || vertexpos[i * 3 + 1] > 10) particleData.velocity.y *= -1;
        if (vertexpos[i * 3] < -10 || vertexpos[i * 3] > 10) particleData.velocity.x *= -1;
        if (vertexpos[i * 3 + 2] < -10 || vertexpos[i * 3 + 2] > 10) particleData.velocity.z *= -1;

        // Check connections
        for (let j = i + 1; j < particlesCount; j++) {
            const dx = vertexpos[i * 3] - vertexpos[j * 3];
            const dy = vertexpos[i * 3 + 1] - vertexpos[j * 3 + 1];
            const dz = vertexpos[i * 3 + 2] - vertexpos[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDistance) {
                const alpha = 1.0 - dist / maxDistance;

                linepos[vertexposIndex++] = vertexpos[i * 3];
                linepos[vertexposIndex++] = vertexpos[i * 3 + 1];
                linepos[vertexposIndex++] = vertexpos[i * 3 + 2];

                linepos[vertexposIndex++] = vertexpos[j * 3];
                linepos[vertexposIndex++] = vertexpos[j * 3 + 1];
                linepos[vertexposIndex++] = vertexpos[j * 3 + 2];

                linecol[colorposIndex++] = alpha * 0.5;
                linecol[colorposIndex++] = alpha * 0.1;
                linecol[colorposIndex++] = alpha * 1.0;

                linecol[colorposIndex++] = alpha * 0.5;
                linecol[colorposIndex++] = alpha * 0.1;
                linecol[colorposIndex++] = alpha * 1.0;

                numConnected++;
            }
        }
    }

    group.children[1].geometry.attributes.position.needsUpdate = true;
    group.children[2].geometry.attributes.position.needsUpdate = true;
    group.children[2].geometry.attributes.color.needsUpdate = true;

    group.rotation.y += 0.001;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initThree();