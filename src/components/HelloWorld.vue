<template>
  <span v-if="showPaintUI" id="zonedraw"></span>
  <div ref="viewer" class="viewer" :style="{ cursor: cursorVisible ? 'none' : 'default' }"></div>
  <div v-if="showPaintUI" class="paint-ui">
    <label>Brush size: <input type="range" min="1" max="50" v-model.number="brushSize" /></label>
    <label>Color:
      <input type="color" v-model="brushColor" class="color-picker" />
    </label>
    <button @click="clearPaint" class="clear-button">Clear</button>
    <button @click="resetPaint" class="reset-button">Reset</button>
  </div>
  <div v-show="showPaintUI && cursorVisible" :style="brushCursorStyle" class="brush-cursor"></div>
</template>

<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const viewer = ref(null)
const showPaintUI = ref(false)
const brushSize = ref(10)
const brushColor = ref('#ff0000')

const brushCursorX = ref(0)
const brushCursorY = ref(0)
const cursorVisible = ref(false)
const isDrawing = ref(false)
const paintSpheres = ref([])
const scaleFactor = ref(0.005)
const lastPoint = ref(null)
const drawingThrottleTime = ref(10) // ms entre chaque point pour limiter le nombre de sphères
const lastDrawTime = ref(0)

// Référence à la scène et au modèle pour les utiliser dans les fonctions de nettoyage
const sceneRef = ref(null)
const modelRef = ref(null)
const cameraRef = ref(null)
const rendererRef = ref(null)

// Calculer la couleur de bordure contrastée pour le curseur
const contrastColor = computed(() => {
  // Si la couleur est noire ou très foncée, utiliser une bordure blanche
  if (brushColor.value === '#000000' || isDarkColor(brushColor.value)) {
    return '#ffffff';
  }
  // Sinon utiliser la couleur du pinceau
  return brushColor.value;
})

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

const brushCursorStyle = computed(() => ({
  left: brushCursorX.value + 'px',
  top: brushCursorY.value + 'px',
  width: brushSize.value * 2 + 'px',
  height: brushSize.value * 2 + 'px',
  borderColor: contrastColor.value,
  backgroundColor: brushColor.value + '40' // Ajouter couleur de fond avec opacité
}))

// Fonction pour effacer tous les dessins
function clearPaint() {
  if (paintSpheres.value.length > 0) {
    const scene = sceneRef.value
    if (!scene) return

    // Utilisation d'une méthode plus efficace pour supprimer les sphères
    paintSpheres.value.forEach(sphere => {
      scene.remove(sphere)
      if (sphere.geometry) sphere.geometry.dispose()
      if (sphere.material) sphere.material.dispose()
    })
    paintSpheres.value = []
  }
}

// Fonction pour réinitialiser tous les dessins
function resetPaint() {
  clearPaint()
  brushSize.value = 10
  brushColor.value = '#ff0000'
}

// Création d'une seule géométrie réutilisable pour les sphères
const createCachedGeometry = (size) => {
  return new THREE.SphereGeometry(size, 8, 8)
}

// Ajouter une sphère à la position spécifiée
function addSphereAt(point, color, size, scene) {
  // Utilisation d'un pool de géométries pour réduire la création d'objets
  const geometry = createCachedGeometry(size)
  const material = new THREE.MeshBasicMaterial({ color })
  
  const sphere = new THREE.Mesh(geometry, material)
  sphere.position.copy(point)
  scene.add(sphere)
  paintSpheres.value.push(sphere)
  
  // Mettre à jour le dernier point pour l'interpolation
  lastPoint.value = point.clone()
}

// Dessiner une ligne entre deux points pour plus de fluidité
function drawLineBetween(startPoint, endPoint, steps, color, size, scene) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = startPoint.x + (endPoint.x - startPoint.x) * t
    const y = startPoint.y + (endPoint.y - startPoint.y) * t
    const z = startPoint.z + (endPoint.z - startPoint.z) * t
    
    const point = new THREE.Vector3(x, y, z)
    addSphereAt(point, color, size, scene)
  }
}

onMounted(() => {
  const scene = new THREE.Scene()
  sceneRef.value = scene
  scene.background = new THREE.Color(0xeeeeee)

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  cameraRef.value = camera
  camera.position.set(0, 1, 5)

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: 'high-performance' // Améliorer les performances
  })
  rendererRef.value = renderer
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  viewer.value.appendChild(renderer.domElement)

  // Gestion du redimensionnement de la fenêtre
  const handleResize = () => {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }
  window.addEventListener('resize', handleResize)

  const light = new THREE.HemisphereLight(0xffffff, 0x444444)
  scene.add(light)
  const dirLight = new THREE.DirectionalLight(0xffffff)
  dirLight.position.set(0, 1, 1).normalize()
  scene.add(dirLight)

  const wallGeometry = new THREE.PlaneGeometry(20, 20)
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xdcdcdc })
  const wall = new THREE.Mesh(wallGeometry, wallMaterial)
  wall.position.z = -5
  scene.add(wall)

  const loader = new GLTFLoader()
  let mixer
  let model
  let animationStopped = false
  let interactionDone = false

  loader.load('/models/ESports Jersey Mockup.glb', (gltf) => {
    model = gltf.scene
    modelRef.value = model
    model.scale.set(1, 1, 1);
    model.position.y = -0.8
    scene.add(model)

    // Optimiser le modèle pour les performances
    model.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = false
        object.receiveShadow = false
      }
    })

    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model)
      const clip = THREE.AnimationClip.findByName(gltf.animations, 'Résumé')
      if (clip) {
        const action = mixer.clipAction(clip)
        action.play()
      }
    }
  })

  const clock = new THREE.Clock()

  function animate() {
    requestAnimationFrame(animate)
    const delta = clock.getDelta()
    if (mixer) mixer.update(delta)
    if (model && !animationStopped) model.rotation.y += 0.005
    renderer.render(scene, camera)
  }

  function stopAnimationAndReposition() {
    if (interactionDone || !model) return
    interactionDone = true
    animationStopped = true
    model.rotation.y = 0
    setTimeout(() => {
      model.rotation.y = Math.PI
      showPaintUI.value = true
      enablePainting()
    }, 200)
  }

  function enablePainting() {
    const domElement = renderer.domElement
    const raycaster = new THREE.Raycaster()

    function updateBrushCursor(e) {
      brushCursorX.value = e.clientX
      brushCursorY.value = e.clientY
      const zonedraw = document.getElementById('zonedraw')
      if (!zonedraw) return
      const rect = zonedraw.getBoundingClientRect()
      const x = e.clientX
      const y = e.clientY
      cursorVisible.value = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    }

    function getIntersectionPoint(event) {
      const zonedraw = document.getElementById('zonedraw')
      if (!zonedraw || !model) return null
      
      const rect = zonedraw.getBoundingClientRect()
      const inZone = event.clientX >= rect.left && event.clientX <= rect.right && 
                     event.clientY >= rect.top && event.clientY <= rect.bottom
      if (!inZone) return null

      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      )
      
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(model, true)
      
      if (intersects.length > 0) {
        return intersects[0].point
      }
      
      return null
    }

    function drawOnModel(event) {
      const now = Date.now()
      if (now - lastDrawTime.value < drawingThrottleTime.value) return
      lastDrawTime.value = now
      
      const point = getIntersectionPoint(event)
      if (!point) return
      
      // Si c'est le premier point ou s'il n'y a pas de dernier point
      if (!lastPoint.value) {
        addSphereAt(point, brushColor.value, brushSize.value * scaleFactor.value, scene)
      } else {
        // Calculer la distance pour déterminer combien de points intermédiaires
        const distance = lastPoint.value.distanceTo(point)
        const steps = Math.ceil(distance / (brushSize.value * scaleFactor.value * 0.5))
        
        if (steps > 1) {
          // Dessiner une ligne interpolée pour une meilleure fluidité
          drawLineBetween(
            lastPoint.value, 
            point, 
            steps, 
            brushColor.value, 
            brushSize.value * scaleFactor.value, 
            scene
          )
        } else {
          // Si les points sont très proches, ajouter simplement un point
          addSphereAt(point, brushColor.value, brushSize.value * scaleFactor.value, scene)
        }
      }
    }

    const handlePointerDown = (e) => {
      isDrawing.value = true
      lastPoint.value = null // Réinitialiser le point de départ
      drawOnModel(e)
    }
    
    const handlePointerUp = () => {
      isDrawing.value = false
      lastPoint.value = null // Réinitialiser après avoir terminé
    }
    
    const handlePointerMove = (e) => {
      updateBrushCursor(e)
      if (isDrawing.value) drawOnModel(e)
    }

    domElement.addEventListener('pointerdown', handlePointerDown)
    domElement.addEventListener('pointerup', handlePointerUp)
    domElement.addEventListener('pointerout', handlePointerUp)
    domElement.addEventListener('pointermove', handlePointerMove)
    
    // Stocker les nettoyeurs d'événements pour le démontage
    onBeforeUnmount(() => {
      domElement.removeEventListener('pointerdown', handlePointerDown)
      domElement.removeEventListener('pointerup', handlePointerUp)
      domElement.removeEventListener('pointerout', handlePointerUp)
      domElement.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
    })
  }

  viewer.value.addEventListener('click', stopAnimationAndReposition)
  viewer.value.addEventListener('touchstart', stopAnimationAndReposition)

  animate()
})
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
  width: 500px;
  height: 500px;
  background: none;
  border: 2px dashed #000;
  transform: translate(-45%, -50%);
  pointer-events: none;
  z-index: 1;
}
.paint-ui {
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  font-family: sans-serif;
}
.color-picker {
  margin-left: 8px;
  vertical-align: middle;
}
.clear-button, .reset-button {
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
}
.reset-button {
  background: #ffeeee;
}
.clear-button:hover, .reset-button:hover {
  background: #e0e0e0;
}
.brush-cursor {
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  border: 2px solid;
  transform: translate(-50%, -50%);
  z-index: 9999;
  /* mix-blend-mode supprimé */
}
</style>