<template>
  <span v-if="showPaintUI" id="zonedraw"></span>
  <div
    ref="viewer"
    class="viewer"
    :style="{ cursor: cursorVisible ? 'none' : 'default' }"
  ></div>
  <div v-if="showPaintUI" class="paint-ui">
    <div class="tool-section">
      <h2>Select a tool</h2>
      <div>

        <button
          @click="setTool('brush')"
          :class="{ active: currentTool === 'brush' }"
          class="tool-button"
        >
          <span class="tool-icon">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M8.29289 3.70711L1 11V15H5L12.2929 7.70711L8.29289 3.70711Z"
                  fill="#000000"
                ></path>
                <path
                  d="M9.70711 2.29289L13.7071 6.29289L15.1716 4.82843C15.702 4.29799 16 3.57857 16 2.82843C16 1.26633 14.7337 0 13.1716 0C12.4214 0 11.702 0.297995 11.1716 0.828428L9.70711 2.29289Z"
                  fill="#000000"
                ></path>
              </g>
            </svg>
          </span>
          Brush
        </button>
        <button
          @click="setTool('eraser')"
          :class="{ active: currentTool === 'eraser' }"
          class="tool-button"
        >
          <span class="tool-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.0302 22H13.9902C13.5702 22 13.2402 21.66 13.2402 21.25C13.2402 20.84 13.5802 20.5 13.9902 20.5H21.0302C21.4502 20.5 21.7802 20.84 21.7802 21.25C21.7802 21.66 21.4502 22 21.0302 22Z" fill="#292D32"></path> <path d="M13.64 16.6894C14.03 17.0794 14.03 17.7094 13.64 18.1094L10.66 21.0894C9.55 22.1994 7.77 22.2594 6.59 21.2694C6.52 21.2094 6.46 21.1494 6.4 21.0894L5.53 20.2194L3.74 18.4294L2.88 17.5694C2.81 17.4994 2.75 17.4294 2.69 17.3594C1.71 16.1794 1.78 14.4194 2.88 13.3194L5.86 10.3394C6.25 9.94938 6.88 9.94938 7.27 10.3394L13.64 16.6894Z" fill="#292D32"></path> <path d="M21.1194 10.6414L16.1194 15.6414C15.7294 16.0314 15.0994 16.0314 14.7094 15.6414L8.33937 9.29141C7.94938 8.90141 7.94938 8.27141 8.33937 7.87141L13.3394 2.88141C14.5094 1.71141 16.4294 1.71141 17.5994 2.88141L21.1194 6.39141C22.2894 7.56141 22.2894 9.47141 21.1194 10.6414Z" fill="#292D32"></path> </g></svg></span> Eraser
        </button>
        <button
          @click="setTool('text')"
          :class="{ active: currentTool === 'text' }"
          class="tool-button"
        >
          <span class="tool-icon"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15 1H1V15H15V1ZM3 3V7H5V5H7V11H5V13H11V11H9V5H11V7H13V3H3Z" fill="#000000"></path> </g></svg></span> Text
        </button>
      </div>
    </div>

    <div
      class="brush-controls"
      v-if="currentTool === 'brush' || currentTool === 'text'"
    >
      <label
        >Size: <input type="range" min="1" max="50" v-model.number="brushSize"
      /></label>
      <input
        type="text"
        v-model="textInput"
        placeholder="Enter text"
        class="text-input"
        v-if="currentTool === 'text'"
      />
    </div>
    
    <label v-if="currentTool === 'brush' || currentTool === 'text'" class="color-section">
      <h2>Select a color</h2>
      <div class="color-options">
        <label>
          <input type="radio" v-model="brushColor" value="#6AA24A" class="color-input" checked />
          <span style="background-color: #6AA24A;" class="color-swatch"></span>
        </label>
        <label>
          <input type="radio" v-model="brushColor" value="#F6EE80" class="color-input" />
          <span style="background-color: #F6EE80;" class="color-swatch"></span>
        </label>
        <label>
          <input type="radio" v-model="brushColor" value="#F9D5E7" class="color-input" />
          <span style="background-color: #F9D5E7;" class="color-swatch"></span>
        </label>
        <label>
          <input type="radio" v-model="brushColor" value="#000000" class="color-input" />
          <span style="background-color: #000000;" class="color-swatch"></span>
        </label>
        <label>
          <input type="radio" v-model="brushColor" value="#FFFFFF" class="color-input" />
          <span style="background-color: #FFFFFF;" class="color-swatch"></span>
        </label>
      </div>
    </label>

    <div class="action-buttons">
      <button @click="clearPaint" class="action-button clear-button">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z" fill="#33363F"></path> </g></svg> Clear All
      </button>
    </div>
  </div>

  <div
    v-if="
      showPaintUI &&
      cursorVisible &&
      (currentTool === 'brush' || currentTool === 'eraser')
    "
    :style="brushCursorStyle"
    class="brush-cursor"
  ></div>

  <div v-if="showTextPreview" :style="textPreviewStyle" class="text-preview">
    {{ textInput }}
  </div>

  <button v-if="showPaintUI" @click="saveDrawing" class="button">
    CONFIRM MY JERSEY
  </button>
  <a href="/model-choice" class="back">Back</a>
  <img src="/public/img/LogoHuddleVert.png" class="logo" alt="Logo Huddle" />
</template>

<script setup>
import { onMounted, ref, computed, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { useRouter } from "vue-router";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const router = useRouter();

const viewer = ref(null);
const showPaintUI = ref(false);
const brushSize = ref(10);
const brushColor = ref("#6AA24A");
const textInput = ref("");
const textSize = ref(brushSize.value + 10);
const textColor = ref(brushColor.value);
const currentTool = ref("brush");
const showTextPreview = ref(false);
const textPreviewX = ref(0);
const textPreviewY = ref(0);

const brushCursorX = ref(0);
const brushCursorY = ref(0);
const cursorVisible = ref(false);
const isDrawing = ref(false);
const paintSpheres = ref([]);
const textElements = ref([]);
const scaleFactor = ref(0.005);
const lastPoint = ref(null);
const drawingThrottleTime = ref(10); // ms entre chaque point pour limiter le nombre de sphères
const lastDrawTime = ref(0);
const eraserSize = ref(0.05); // Taille de la gomme en unités Three.js

// Référence à la scène et au modèle pour les utiliser dans les fonctions de nettoyage
const sceneRef = ref(null);
const modelRef = ref(null);
const cameraRef = ref(null);
const rendererRef = ref(null);
const canvasGroup = ref(null); // Pour regrouper tous les éléments de dessin

import { useRoute } from "vue-router";

const route = useRoute();

const modelQuery = ref(route.query.model || "model1");

async function saveDrawing() {
  const renderer = rendererRef.value;

  if (!renderer) {
    console.error("Renderer introuvable");
    return;
  }

  let baseName = "mon-dessin";
  let ext = ".png";
  let i = 0;
  let filename = Date.now() + "-" + `${baseName}${ext}`;
  const exportPath = "used_filenames/";

  // while (localStorage.getItem(exportPath + filename)) {
  //   i++;
  //   filename =  Date.now()+'-'+`${baseName}_${i}${ext}`;
  // }
  localStorage.setItem(exportPath + filename, "used");

  try {
    const originalCanvas = renderer.domElement;

    const tempCanvas = document.createElement("canvas");
    const tempContext = tempCanvas.getContext("2d");

    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;

    // ❌ Ne pas dessiner de fond → fond transparent par défaut

    tempContext.drawImage(originalCanvas, 0, 0);

    tempCanvas.toBlob(async (blob) => {
      if (!blob) {
        alert("Erreur : aucune image générée.");
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, filename);
      if (modelQuery.value === "1") {
        formData.append("color", "Maillot Rose"); // à adapter selon ton interface
      } else {
        formData.append("color", "Maillot Vert"); // à adapter selon ton interface
      }

      try {
        const response = await fetch("http://localhost:3001/jerseys", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.id) {
          console.log("Image enregistrée avec succès :", data);
          localStorage.setItem("lastExportedFile", filename);
          router.push({ path: "/inscription", query: { jerseyId: data.id } });
        } else {
          console.error("Erreur lors de l'enregistrement :", data.error);
          alert("Erreur lors de l'enregistrement du maillot.");
        }
      } catch (err) {
        console.error("Erreur réseau :", err);
        alert("Erreur réseau lors de l’envoi de l’image.");
      }
    }, "image/png"); // PNG = supporte la transparence
  } catch (error) {
    console.error("Erreur lors de l'exportation :", error);
  }
}

// Watch for changes in the route query
watch(
  () => route.query.model,
  (newModel) => {
    modelQuery.value = newModel || "model1";
  }
);

// Fonction pour définir l'outil actuel
function setTool(tool) {
  currentTool.value = tool;
  if (tool === "text") {
    showTextPreview.value = true;
  } else {
    showTextPreview.value = false;
  }

  // Ajuster la taille de l'outil eraser
  if (tool === "eraser") {
    eraserSize.value = brushSize.value * scaleFactor.value * 1.5;
  }
}

// Surveiller les changements de taille de pinceau pour mettre à jour la taille de la gomme
watch(brushSize, (newSize) => {
  if (currentTool.value === "eraser") {
    eraserSize.value = newSize * scaleFactor.value * 1.5;
  }
});

// Calculer la couleur de bordure contrastée pour le curseur
const contrastColor = computed(() => {
  if (currentTool.value === "eraser") return "#ff0000";

  // Si la couleur est noire ou très foncée, utiliser une bordure blanche
  if (brushColor.value === "#000000" || isDarkColor(brushColor.value)) {
    return "#ffffff";
  }
  // Sinon utiliser la couleur du pinceau
  return brushColor.value;
});

// Style pour le curseur de pinceau/gomme
const brushCursorStyle = computed(() => ({
  left: brushCursorX.value + "px",
  top: brushCursorY.value + "px",
  width: brushSize.value * 2 + "px",
  height: brushSize.value * 2 + "px",
  borderColor: contrastColor.value,
  backgroundColor:
    currentTool.value === "eraser"
      ? "rgba(255,0,0,0.2)"
      : brushColor.value + "40",
  mixBlendMode: currentTool.value === "eraser" ? "difference" : "normal",
}));

// Style pour l'aperçu du texte
const textPreviewStyle = computed(() => ({
  left: textPreviewX.value + "px",
  top: textPreviewY.value + "px",
  fontSize: brushSize.value + "px",
  color: brushColor.value,
}));

// Fonction pour vérifier si une couleur est foncée
function isDarkColor(hexColor) {
  // Convertir hexadécimal en RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculer la luminosité (formule approximative)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Considérer comme foncée si la luminosité est inférieure à 50
  return brightness < 50;
}

// Fonction pour effacer tous les dessins
function clearPaint() {
  const scene = sceneRef.value;
  if (!scene) return;

  // Supprimer les sphères du groupe de canvas
  if (canvasGroup.value) {
    while (canvasGroup.value.children.length > 0) {
      const object = canvasGroup.value.children[0];
      canvasGroup.value.remove(object);

      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
  }

  // Réinitialiser les tableaux
  paintSpheres.value = [];
  textElements.value = [];
}

// Création d'une seule géométrie réutilisable pour les sphères
const createCachedGeometry = (size) => {
  return new THREE.SphereGeometry(size, 8, 8);
};

// Ajouter une sphère à la position spécifiée (pinceau)
function addSphereAt(point, color, size, scene) {
  // Utilisation d'un pool de géométries pour réduire la création d'objets
  const geometry = createCachedGeometry(size);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.9,
    blending: THREE.NormalBlending, // Pour simuler le mix-blend-mode
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(point);

  // Ajouter au groupe de canvas pour l'effet de "mix-blend-mode"
  if (canvasGroup.value) {
    canvasGroup.value.add(sphere);
  } else {
    scene.add(sphere);
  }

  paintSpheres.value.push(sphere);

  // Mettre à jour le dernier point pour l'interpolation
  lastPoint.value = point.clone();
}

// Fonction de gomme - supprime les sphères proches du point
function eraseAtPoint(point, size) {
  if (!canvasGroup.value) return;

  // Tableau pour les objets à supprimer
  const objectsToRemove = [];

  // Parcourir tous les enfants du groupe canvas
  canvasGroup.value.children.forEach((object) => {
    // Calculer la distance entre le point d'effacement et l'objet
    const distance = object.position.distanceTo(point);

    // Si la distance est inférieure à la taille de la gomme
    if (distance < size) {
      objectsToRemove.push(object);
    }
  });

  // Supprimer les objets identifiés
  objectsToRemove.forEach((object) => {
    // Supprimer du groupe
    canvasGroup.value.remove(object);

    // Nettoyer la mémoire
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }

    // Supprimer du tableau s'il s'agit d'une sphère de peinture
    const index = paintSpheres.value.indexOf(object);
    if (index !== -1) {
      paintSpheres.value.splice(index, 1);
    }

    // Supprimer du tableau s'il s'agit d'un texte
    const textIndex = textElements.value.indexOf(object);
    if (textIndex !== -1) {
      textElements.value.splice(textIndex, 1);
    }
  });

  // Mettre à jour le dernier point pour l'interpolation
  lastPoint.value = point.clone();
}

// Dessiner une ligne entre deux points pour plus de fluidité
function drawLineBetween(startPoint, endPoint, steps, color, size, scene) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = startPoint.x + (endPoint.x - startPoint.x) * t;
    const y = startPoint.y + (endPoint.y - startPoint.y) * t;
    const z = startPoint.z + (endPoint.z - startPoint.z) * t;

    const point = new THREE.Vector3(x, y, z);
    addSphereAt(point, color, size, scene);
  }
}

// Fonction pour effacer une ligne entre deux points
function eraseLineBetween(startPoint, endPoint, steps, size) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = startPoint.x + (endPoint.x - startPoint.x) * t;
    const y = startPoint.y + (endPoint.y - startPoint.y) * t;
    const z = startPoint.z + (endPoint.z - startPoint.z) * t;

    const point = new THREE.Vector3(x, y, z);
    eraseAtPoint(point, size);
  }
}

// Ajouter du texte au modèle
function addTextToModel(position, text, color, size) {
  if (!text.trim()) return;

  // Créer une texture canvas pour le texte
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const fontSize = size; // Taille ajustée pour la lisibilité

  // Configurer le canvas pour le texte
  canvas.width = text.length * fontSize * 0.8;
  canvas.height = fontSize * 1.5;
  context.font = `${fontSize}px Arial`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Fond transparent
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner le texte
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // Créer une texture à partir du canvas
  const texture = new THREE.CanvasTexture(canvas);

  // Créer un matériau avec la texture
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });

  // Créer un plan pour afficher le texte
  const geometry = new THREE.PlaneGeometry(
    canvas.width * 0.005,
    canvas.height * 0.005
  );
  const textMesh = new THREE.Mesh(geometry, material);

  // Positionner le texte
  // Position the text at the intersection point
  textMesh.position.copy(position);

  // Get normal vector at intersection point (direction perpendicular to surface)
  const normal = new THREE.Vector3();
  normal.subVectors(cameraRef.value.position, position).normalize();

  // Add slight offset along normal to prevent z-fighting
  textMesh.position.add(normal.multiplyScalar(0.05));

  // Make text face the camera
  textMesh.lookAt(cameraRef.value.position);

  // Ajouter au groupe de canvas
  if (canvasGroup.value) {
    canvasGroup.value.add(textMesh);
  } else {
    sceneRef.value.add(textMesh);
  }

  textElements.value.push(textMesh);
}

onMounted(() => {
  const scene = new THREE.Scene();
  sceneRef.value = scene;
  // Définir un fond transparent au lieu d'une couleur de fond
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  cameraRef.value = camera;
  camera.position.set(0, 1, 5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
    alpha: true, // Activer la transparence du renderer
  });
  rendererRef.value = renderer;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  // Activer la transparence dans le renderer
  renderer.setClearColor(0x000000, 0);
  viewer.value.appendChild(renderer.domElement);

  // Gestion du redimensionnement de la fenêtre
  const handleResize = () => {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };
  window.addEventListener("resize", handleResize);

  // Éclairage
  const light = new THREE.HemisphereLight(0xffffff, 0x82826e, 1);
  scene.add(light);
  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(0, 1, 1).normalize();
  scene.add(dirLight);

  // Créer un groupe pour tous les éléments de dessin
  const group = new THREE.Group();
  canvasGroup.value = group;
  scene.add(group);

  // Supprimer le mur de fond pour avoir un arrière-plan transparent

  const loader = new GLTFLoader();
  let mixer;
  let model;
  let animationStopped = false;
  let interactionDone = false;

  if (modelQuery.value === "1") {
    loader.load("/models/jersey1.glb", (gltf) => {
      model = gltf.scene;
      modelRef.value = model;
      model.scale.set(1, 1, 1);
      model.position.y = -0.6;
      scene.add(model);

      model.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = false;
          object.receiveShadow = false;
        }
      });

      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(gltf.animations, "Résumé");
        if (clip) {
          const action = mixer.clipAction(clip);
          action.play();
        }
      }
    });
  } else if (modelQuery.value === "2") {
    loader.load("/models/jersey2.glb", (gltf) => {
      model = gltf.scene;
      modelRef.value = model;
      model.scale.set(1, 1, 1);
      model.position.y = -0.6;
      scene.add(model);

      model.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = false;
          object.receiveShadow = false;
        }
      });

      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(gltf.animations, "Résumé");
        if (clip) {
          const action = mixer.clipAction(clip);
          action.play();
        }
      }
    });
  }

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    if (model && !animationStopped) model.rotation.y += 0.005;
    renderer.render(scene, camera);
  }

  function stopAnimationAndReposition() {
    if (interactionDone || !model) return;
    interactionDone = true;
    animationStopped = true;
    model.rotation.y = 0;
    setTimeout(() => {
      model.rotation.y = Math.PI;
      showPaintUI.value = true;
      enablePainting();
    }, 200);
  }

  function enablePainting() {
    const domElement = renderer.domElement;
    const raycaster = new THREE.Raycaster();

    function updateBrushCursor(e) {
      brushCursorX.value = e.clientX;
      brushCursorY.value = e.clientY;

      // Mise à jour de la position de l'aperçu du texte aussi
      if (currentTool.value === "text") {
        textPreviewX.value = e.clientX;
        textPreviewY.value = e.clientY;
      }

      const zonedraw = document.getElementById("zonedraw");
      if (!zonedraw) return;
      const rect = zonedraw.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      cursorVisible.value =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    function getIntersectionPoint(event) {
      const zonedraw = document.getElementById("zonedraw");
      if (!zonedraw || !model) return null;

      const rect = zonedraw.getBoundingClientRect();
      const inZone =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inZone) return null;

      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      // Intersecter avec le modèle
      const intersects = raycaster.intersectObject(model, true);

      if (intersects.length > 0) {
        return intersects[0].point;
      }

      return null;
    }

    function interactWithModel(event) {
      // Obtenir le point d'intersection
      const point = getIntersectionPoint(event);
      if (!point) return;

      const now = Date.now();
      if (now - lastDrawTime.value < drawingThrottleTime.value) return;
      lastDrawTime.value = now;

      // Gérer l'outil actuel
      if (currentTool.value === "brush") {
        // Si c'est le premier point ou s'il n'y a pas de dernier point
        if (!lastPoint.value) {
          addSphereAt(
            point,
            brushColor.value,
            brushSize.value * scaleFactor.value,
            scene
          );
        } else {
          // Calculer la distance pour déterminer combien de points intermédiaires
          const distance = lastPoint.value.distanceTo(point);
          const steps = Math.ceil(
            distance / (brushSize.value * scaleFactor.value * 0.5)
          );

          if (steps > 1) {
            // Dessiner une ligne interpolée pour une meilleure fluidité
            drawLineBetween(
              lastPoint.value,
              point,
              steps,
              brushColor.value,
              brushSize.value * scaleFactor.value,
              scene
            );
          } else {
            // Si les points sont très proches, ajouter simplement un point
            addSphereAt(
              point,
              brushColor.value,
              brushSize.value * scaleFactor.value,
              scene
            );
          }
        }
      } else if (currentTool.value === "eraser") {
        // Utiliser la fonction améliorée de gomme
        if (!lastPoint.value) {
          eraseAtPoint(point, eraserSize.value);
        } else {
          // Utiliser l'interpolation pour une gomme fluide
          const distance = lastPoint.value.distanceTo(point);
          const steps = Math.ceil(distance / (eraserSize.value * 0.5));

          if (steps > 1) {
            eraseLineBetween(lastPoint.value, point, steps, eraserSize.value);
          } else {
            eraseAtPoint(point, eraserSize.value);
          }
        }
      }
    }

    function placeText(event) {
      if (currentTool.value !== "text") return;

      const point = getIntersectionPoint(event);
      if (!point) return;

      addTextToModel(point, textInput.value, brushColor.value, brushSize.value);
    }

    const handlePointerDown = (e) => {
      if (currentTool.value === "text") {
        placeText(e);
      } else {
        isDrawing.value = true;
        lastPoint.value = null; // Réinitialiser le point de départ
        interactWithModel(e);
      }
    };

    const handlePointerUp = () => {
      isDrawing.value = false;
      lastPoint.value = null; // Réinitialiser après avoir terminé
    };

    const handlePointerMove = (e) => {
      updateBrushCursor(e);
      if (isDrawing.value) interactWithModel(e);
    };

    domElement.addEventListener("pointerdown", handlePointerDown);
    domElement.addEventListener("pointerup", handlePointerUp);
    domElement.addEventListener("pointerout", handlePointerUp);
    domElement.addEventListener("pointermove", handlePointerMove);

    // Stocker les nettoyeurs d'événements pour le démontage
    onBeforeUnmount(() => {
      domElement.removeEventListener("pointerdown", handlePointerDown);
      domElement.removeEventListener("pointerup", handlePointerUp);
      domElement.removeEventListener("pointerout", handlePointerUp);
      domElement.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
    });
  }

  viewer.value.addEventListener("click", stopAnimationAndReposition);
  viewer.value.addEventListener("touchstart", stopAnimationAndReposition);

  animate();
});
</script>

<style scoped>
.viewer {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
#zonedraw {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18vw;
  height: 30vh;
  background: none;
  border: 2px dashed #000;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

h2{
  color: #6AA24A;
  font-size: 4rem;
  margin: 2%;
  font-family: 'Berlin Sans FB', sans-serif;
}

.tool-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
  position: absolute;
  top: 30%;
  right: 5%;
  width: 25%;
}
.tool-section div{
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: space-between;
}
.tool-button {
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  width: 25% ;
  font-size: 1.5rem;
}
.tool-button.active svg path {
  fill: #6AA24A;
}
.tool-button.active  {
  color: #6AA24A;
}
.tool-icon {
  font-size: 16px;
}
.brush-controls{
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 25%;
  position: absolute;
  top: 50%;
  right: 5%;
  font-family: "montserrat", sans-serif;
}
.text-input {
  padding: 10px 15px ;
  border: 2px solid #6AA24A;
  background: transparent;
  border-radius: 30px;
  width: 100%;
  margin-top: 20px;
}
.color-picker {
  margin-left: 8px;
  vertical-align: middle;
}
.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.action-button {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.clear-button {
  background: #6AA24A;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #FFFCDE;
  fill: #FFFCDE;
  font-size: 1.5rem;
  gap: 10px;
  border-radius: 100px;
  position: absolute;
  top: 70%;
  left: 12.5%;
}
.clear-button svg path{
  fill: #FFFCDE;
}
.brush-cursor {
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  border: 2px solid;
  transform: translate(-50%, -50%);
  z-index: 9999;
  mix-blend-mode: normal;
}
.text-preview {
  position: fixed;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 9999;
  padding: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  white-space: nowrap;
  font-family: "montserrat", sans-serif;
}
.button {
  background-color: #6AA24A;
    color: #FFFCDE;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    border-radius: 5px;
    font-family: 'Berlin Sans FB', sans-serif;
    height: 70px;
    width: 30%;
    border-radius: 100px;
    position: absolute;
    bottom: 20%;
    right: 5%;
}
.color-input {
  display: none;
}
.color-swatch {
  width: 50px;
  height: 50px;
  margin: 30px 0;
  display: block;
  border-radius: 100%;;
}
.color-input:checked + .color-swatch {
  outline: 2px solid black;
}
svg {
  width: 30px;
  height: 30px;
}
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;  
  background: #acc46b;
  outline: none;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

input[type="range" i]::-webkit-slider-thumb  {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%; 
  background: #6AA24A;
  cursor: pointer;
}

input[type="range"] ::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6AA24A;
  cursor: pointer;
}
.color-section{
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 10%;
  left: 5%;
  width: 25%;
  align-items: center;
}
.back{
  position: absolute;
  bottom: 15%;
  left: 16%;
  font-size: 1.5rem;
  color: #6AA24A;
  text-decoration: underline;
}
</style>
