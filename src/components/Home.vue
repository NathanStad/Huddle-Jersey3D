<template>
    <div class="home">
        <div>
            <h1>PIMP MY JERSEY</h1>
            <p>Customize your official Huddle jersey and proudly show your identity as a future coach!</p>
        </div>
        <!-- Conteneur pour le modèle 3D -->
        <div id="jersey-model-container" class="model-container"></div>
        <button @click="goToNextPage">LET'S GO</button>
    </div>
    <img src="/public/img/Logo_SansFond.png" class="logo" alt="Logo Huddle" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const router = useRouter();
let scene, camera, renderer, jersey, controls, animationId;

function goToNextPage() {
    router.push("/model-choice");
}

function initThreeJS() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const container = document.getElementById('jersey-model-container');
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();

    loader.load(
        '/models/jersey1.glb',
        (gltf) => {
            jersey = gltf.scene;
            jersey.scale.set(3, 3, 3);
            jersey.position.y = -5; // ↓ descend légèrement le modèle
            scene.add(jersey);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('Une erreur s\'est produite lors du chargement du modèle:', error);
        }
    );

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;

    const animate = () => {
        animationId = requestAnimationFrame(animate);

        if (jersey) {
            jersey.rotation.y += 0.01;
        }

        controls.update();
        renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
        const container = document.getElementById('jersey-model-container');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        if (renderer) {
            renderer.dispose();
        }
        if (controls) {
            controls.dispose();
        }
    });
}

onMounted(() => {
    initThreeJS();
});
</script>

<style scoped>
.home {
    text-align: center;
    display: flex;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background-image: url('../assets/FondGazon.jpg');
    background-size: cover;
}
h1{
    color: #F9D5E7;
    font-size: 5rem;
    font-family: 'Berlin Sans FB', sans-serif;
    margin: 2%;
}

p {
    color: #F9D5E7;
    font-size: 1.5rem;
    margin: 0;
}

.model-container {
    width: 500px;
    height: 500px;
    position: relative;
}

button {
    background-color: #F9D5E7;
    color: #6AA24A;
    border: none;
    padding: 2% 0.5%;
    font-size: 1.5rem;
    cursor: pointer;
    border-radius: 5px;
    font-family: 'Berlin Sans FB', sans-serif;
    width: 40%;
    border-radius: 100px;
}

button:hover {
    background-color: #c699af;
}
</style>
