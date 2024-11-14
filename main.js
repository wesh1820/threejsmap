import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// dat gui voor de zon en klok
const gui = new dat.GUI();
const clockControl = {
    hour: 12, // Default tijd is 12 uur (middag)
};

// Zon
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(sunLight);

// Zon als object
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Zon in GUI
const sunFolder = gui.addFolder('Zon');
sunFolder.add(sunLight.position, 'x', -10, 10);
sunFolder.add(sunLight.position, 'y', -10, 30);  // Zonpositie aanpassen
sunFolder.add(sunLight.position, 'z', -10, 10);
sunFolder.add(sunLight, 'intensity', 0, 1);

// Klok GUI voor het instellen van het uur van de dag
const timeFolder = gui.addFolder('Tijd');
timeFolder.add(clockControl, 'hour', 0, 24, 1).name('Uur van de dag').onChange(updateSunPosition);

// Ambient light (blauwachtige lucht)
const ambientLight = new THREE.AmbientLight(0x87ceeb, 0.5); // Lucht
scene.add(ambientLight);

// Orbit controls voor de camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Blauwe lucht
const skyColor = new THREE.Color(0x87ceeb); // Blauwe lucht
scene.background = skyColor;

// Wolken (beweging)
const cloudTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/skybox/px.jpg'); // Wolktextuur
const cloudMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.8,
});
const cloudGeometry = new THREE.PlaneGeometry(30, 30);
const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud.position.set(0, 15, 0); // Wolken in de lucht
cloud.rotation.x = Math.PI / 2;
scene.add(cloud);

// Beweeg de wolken
let cloudSpeed = 0.02; // Snellere beweging
function moveClouds() {
    cloud.position.x += cloudSpeed;
    if (cloud.position.x > 30) {
        cloud.position.x = -30;
    }
}

// Functie om een huis te maken
function createHouse(x, z) {
    const houseBaseGeometry = new THREE.BoxGeometry(3, 2, 3);
    const houseBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const houseBase = new THREE.Mesh(houseBaseGeometry, houseBaseMaterial);
    houseBase.position.set(x, 0, z);
    houseBase.castShadow = true;

    const houseRoofGeometry = new THREE.ConeGeometry(3, 1.5, 4);
    const houseRoofMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
    const houseRoof = new THREE.Mesh(houseRoofGeometry, houseRoofMaterial);
    houseRoof.position.set(x, 1.5, z);
    houseRoof.rotation.y = Math.PI / 4;

    scene.add(houseBase, houseRoof);
}

// Plaats 20 willekeurige huizen rondom de villa
const numberOfHouses = 20;  // Aantal huizen dat je wilt plaatsen
const range = 30; // Bereik van willekeurige posities rondom de villa

for (let i = 0; i < numberOfHouses; i++) {
    const x = (Math.random() - 0.5) * 4 * range;  // Willekeurige x-coördinaat tussen -range en +range
    const z = (Math.random() - 0.5) * 4 * range;  // Willekeurige z-coördinaat tussen -range en +range
    
    // Zorg ervoor dat de huizen niet op de villa zelf komen
    if (Math.abs(x) > 2 && Math.abs(z) > 2) {
        createHouse(x, z);  // Plaats het huis op de willekeurige locatie
    } else {
        i--;  // Probeer opnieuw als het huis te dichtbij de villa is
    }
}


// Groene grond
const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, side: THREE.DoubleSide }); // Groene kleur voor de grond
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2;
ground.position.y = -1; // Plattegrond op de grond
scene.add(ground);

// Villa vloer
const villaFloorGeometry = new THREE.BoxGeometry(8, 0.1, 8);
const villaFloorMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d });
const villaFloor = new THREE.Mesh(villaFloorGeometry, villaFloorMaterial);
villaFloor.position.y = -1;
villaFloor.receiveShadow = true;
scene.add(villaFloor);

// Villa muren met baksteen textuur
const brickTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/brick_diffuse.jpg');
const brickMaterial = new THREE.MeshStandardMaterial({ map: brickTexture, roughness: 0.5, metalness: 0.1 });

const villaWallGeometry = new THREE.BoxGeometry(8, 3, 0.1);
const villaWall1 = new THREE.Mesh(villaWallGeometry, brickMaterial);
villaWall1.position.set(0, 0.5, -3.9);
scene.add(villaWall1);

const villaWall2 = new THREE.Mesh(villaWallGeometry, brickMaterial);
villaWall2.position.set(0, 0.5, 3.9);
scene.add(villaWall2);

const villaWallSideGeometry = new THREE.BoxGeometry(0.1, 3, 8);
const villaWall3 = new THREE.Mesh(villaWallSideGeometry, brickMaterial);
villaWall3.position.set(-3.9, 0.5, 0);
scene.add(villaWall3);

const villaWall4 = new THREE.Mesh(villaWallSideGeometry, brickMaterial);
villaWall4.position.set(3.9, 0.5, 0);
scene.add(villaWall4);

// Ramen
const windowGeometry = new THREE.BoxGeometry(1, 1, 0.1); // Raam geometrie
const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x89ceeb, transparent: true, opacity: 1 }); // Blauwe transparante kleur
const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
window1.position.set(-2, 1, -4); // Plaatsing van het raam
scene.add(window1);

const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
window2.position.set(2, 1, -4); // Plaatsing van het raam aan de andere kant
scene.add(window2);

// Deur
const doorGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.1); // Deur geometrie
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Houten kleur
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, 0, -4); // Deur in het midden
scene.add(door);

// Dak van de villa
const roofGeometry = new THREE.ConeGeometry(6, 2, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 3;
roof.rotation.y = Math.PI / 4;
roof.castShadow = true;
scene.add(roof);



// Zwembad
const poolGeometry = new THREE.BoxGeometry(6, 0.5, 6);
const poolMaterial = new THREE.MeshStandardMaterial({ color: 0x1e90ff, opacity: 0.8, transparent: true });
const pool = new THREE.Mesh(poolGeometry, poolMaterial);
pool.position.set(8, -1.20, 0);
pool.receiveShadow = true;
scene.add(pool);

// Boom functie
function createTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

    const foliageGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);

    trunk.position.set(x, 0, z);
    foliage.position.set(x, 1.2, z);

    scene.add(trunk, foliage);
}

// Plaats bomen rondom villa
for (let i = -15; i <= 15; i += 10) {
    for (let j = -15; j <= 15; j += 10) {
        if (Math.random() > 0.5) createTree(i, j);
    }
}

// Schilderij in het huis
const paintingTexture = new THREE.TextureLoader().load('/wesley.jpeg');
const paintingGeometry = new THREE.PlaneGeometry(1, 1.5);
const paintingMaterial = new THREE.MeshStandardMaterial({
    map: paintingTexture,
});
const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
painting.position.set(0, 0, 3.8);
painting.rotation.y = Math.PI;
scene.add(painting);

// Camera animatie
camera.position.z = 20;
const clock = new THREE.Clock();
let animateCamera = true;
function animate() {
    if (animateCamera) {
        camera.position.x += 0.15;
        camera.position.z -= 0.25;
        if (camera.position.z < -15) animateCamera = false;
    }

    moveClouds();  // Beweeg de wolken
    updateSunPosition(clockControl.hour); // Pas zon positie aan
    controls.update();
    renderer.render(scene, camera);
}


// Zon positie en intensiteit aanpassen op basis van het uur van de dag
function updateSunPosition(hour) {
    let intensity = 0;
    let yPos = 0;

    // Zonintensiteit & positie aanpassen afhankelijk van het uur
    if (hour >= 6 && hour <= 18) {
        intensity = Math.min(1, (hour - 6) / 12); // Intensiteit stijgt van 6u tot 18u
        yPos = Math.sin((hour - 6) / 12 * Math.PI); // Zon volgt de curve van de hemel
    } else {
        intensity = 0.1; // Zon in de nacht is heel zwak
        yPos = Math.sin((hour - 6) / 12 * Math.PI); // Zon in de nacht, maar wel een negatieve hoogte
    }

    sunLight.intensity = intensity;
    sun.position.y = 10 * yPos; // Zonhoogte
    sun.position.x = 10 * Math.cos((hour / 24) * 2 * Math.PI); // Zon beweegt in een cirkel
    sun.position.z = 10 * Math.sin((hour / 24) * 2 * Math.PI); // Zon beweegt in een cirkel
}

// Resizes the renderer and camera when the window size changes
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Begin animatie na 2 seconden
setTimeout(() => {
    animateCamera = true;
}, 2000);
