<template>
  <span v-if="showPaintUI" id="zonedraw"></span>
  <div ref="viewer" class="viewer" :style="{ cursor: cursorVisible ? 'none' : 'default' }"></div>
  <div v-if="showPaintUI" class="paint-ui">
    <div class="tool-section">
      <button @click="setTool('brush')" :class="{ active: currentTool === 'brush' }" class="tool-button">
        <span class="tool-icon">🖌️</span> Brush
      </button>
      <button @click="setTool('eraser')" :class="{ active: currentTool === 'eraser' }" class="tool-button">
        <span class="tool-icon">🧽</span> Eraser
      </button>
      <button @click="setTool('text')" :class="{ active: currentTool === 'text' }" class="tool-button">
        <span class="tool-icon">T</span> Text
      </button>
    </div>
    
    <div class="brush-controls" v-if="currentTool === 'brush' || currentTool === 'eraser'">
      <label>Size: <input type="range" min="1" max="50" v-model.number="brushSize" /></label>
      <label v-if="currentTool === 'brush'">Color:
        <input type="color" v-model="brushColor" class="color-picker" />
      </label>
    </div>
    
    <div class="text-controls" v-if="currentTool === 'text'">
      <input type="text" v-model="textInput" placeholder="Enter text" class="text-input" />
      <label>Font Size: <input type="range" min="10" max="60" v-model.number="textSize" /></label>
      <label>Color:
        <input type="color" v-model="textColor" class="color-picker" />
      </label>
    </div>
    
    <div class="action-buttons">
      <button @click="clearPaint" class="action-button clear-button">Clear All</button>
    </div>
  </div>
  
  <div v-if="showPaintUI && cursorVisible && (currentTool === 'brush' || currentTool === 'eraser')" 
       :style="brushCursorStyle" 
       class="brush-cursor"></div>
  
  <div v-if="showTextPreview" 
       :style="textPreviewStyle" 
       class="text-preview">{{ textInput }}</div>
  
  <a v-if="showPaintUI" href="/inscrpition" class="button">Terminer</a>
</template>

<script setup>
import { onMounted, ref, computed, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const viewer = ref(null)
const showPaintUI = ref(false)
const brushSize = ref(10)
const brushColor = ref('#000000')
const textInput = ref('')
const textSize = ref(24)
const textColor = ref('#000000')
const currentTool = ref('brush')
const showTextPreview = ref(false)
const textPreviewX = ref(0)
const textPreviewY = ref(0)

const brushCursorX = ref(0)
const brushCursorY = ref(0)
const cursorVisible = ref(false)
const isDrawing = ref(false)
const paintSpheres = ref([])
const textElements = ref([])
const scaleFactor = ref(0.005)
const lastPoint = ref(null)
const drawingThrottleTime = ref(10) // ms entre chaque point pour limiter le nombre de sphères
const lastDrawTime = ref(0)
const eraserSize = ref(0.05) // Taille de la gomme en unités Three.js

// Référence à la scène et au modèle pour les utiliser dans les fonctions de nettoyage
const sceneRef = ref(null)
const modelRef = ref(null)
const cameraRef = ref(null)
const rendererRef = ref(null)
const canvasGroup = ref(null) // Pour regrouper tous les éléments de dessin

// Fonction pour définir l'outil actuel
function setTool(tool) {
  currentTool.value = tool
  if (tool === 'text') {
    showTextPreview.value = true
  } else {
    showTextPreview.value = false
  }
  
  // Ajuster la taille de l'outil eraser
  if (tool === 'eraser') {
    eraserSize.value = brushSize.value * scaleFactor.value * 1.5
  }
}

// Surveiller les changements de taille de pinceau pour mettre à jour la taille de la gomme
watch(brushSize, (newSize) => {
  if (currentTool.value === 'eraser') {
    eraserSize.value = newSize * scaleFactor.value * 1.5
  }
})

// Calculer la couleur de bordure contrastée pour le curseur
const contrastColor = computed(() => {
  if (currentTool.value === 'eraser') return '#ff0000'
  
  // Si la couleur est noire ou très foncée, utiliser une bordure blanche
  if (brushColor.value === '#000000' || isDarkColor(brushColor.value)) {
    return '#ffffff'
  }
  // Sinon utiliser la couleur du pinceau
  return brushColor.value
})

// Style pour le curseur de pinceau/gomme
const brushCursorStyle = computed(() => ({
  left: brushCursorX.value + 'px',
  top: brushCursorY.value + 'px',
  width: brushSize.value * 2 + 'px',
  height: brushSize.value * 2 + 'px',
  borderColor: contrastColor.value,
  backgroundColor: currentTool.value === 'eraser' ? 'rgba(255,0,0,0.2)' : brushColor.value + '40',
  mixBlendMode: currentTool.value === 'eraser' ? 'difference' : 'normal'
}))

// Style pour l'aperçu du texte
const textPreviewStyle = computed(() => ({
  left: textPreviewX.value + 'px',
  top: textPreviewY.value + 'px',
  fontSize: textSize.value + 'px',
  color: textColor.value
}))

// Fonction pour vérifier si une couleur est foncée
function isDarkColor(hexColor) {
  // Convertir hexadécimal en RGB
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  
  // Calculer la luminosité (formule approximative)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  
  // Considérer comme foncée si la luminosité est inférieure à 50
  return brightness < 50
}

// Fonction pour effacer tous les dessins
function clearPaint() {
  const scene = sceneRef.value
  if (!scene) return

  // Supprimer les sphères du groupe de canvas
  if (canvasGroup.value) {
    while (canvasGroup.value.children.length > 0) {
      const object = canvasGroup.value.children[0]
      canvasGroup.value.remove(object)
      
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    }
  }
  
  // Réinitialiser les tableaux
  paintSpheres.value = []
  textElements.value = []
}

// Création d'une seule géométrie réutilisable pour les sphères
const createCachedGeometry = (size) => {
  return new THREE.SphereGeometry(size, 8, 8)
}

// Ajouter une sphère à la position spécifiée (pinceau)
function addSphereAt(point, color, size, scene) {
  // Utilisation d'un pool de géométries pour réduire la création d'objets
  const geometry = createCachedGeometry(size)
  const material = new THREE.MeshBasicMaterial({ 
    color, 
    transparent: true, 
    opacity: 0.9,
    blending: THREE.NormalBlending // Pour simuler le mix-blend-mode
  })
  
  const sphere = new THREE.Mesh(geometry, material)
  sphere.position.copy(point)
  
  // Ajouter au groupe de canvas pour l'effet de "mix-blend-mode"
  if (canvasGroup.value) {
    canvasGroup.value.add(sphere)
  } else {
    scene.add(sphere)
  }
  
  paintSpheres.value.push(sphere)
  
  // Mettre à jour le dernier point pour l'interpolation
  lastPoint.value = point.clone()
}

// Fonction de gomme - supprime les sphères proches du point
function eraseAtPoint(point, size) {
  if (!canvasGroup.value) return
  
  // Tableau pour les objets à supprimer
  const objectsToRemove = []
  
  // Parcourir tous les enfants du groupe canvas
  canvasGroup.value.children.forEach(object => {
    // Calculer la distance entre le point d'effacement et l'objet
    const distance = object.position.distanceTo(point)
    
    // Si la distance est inférieure à la taille de la gomme
    if (distance < size) {
      objectsToRemove.push(object)
    }
  })
  
  // Supprimer les objets identifiés
  objectsToRemove.forEach(object => {
    // Supprimer du groupe
    canvasGroup.value.remove(object)
    
    // Nettoyer la mémoire
    if (object.geometry) object.geometry.dispose()
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose())
      } else {
        object.material.dispose()
      }
    }
    
    // Supprimer du tableau s'il s'agit d'une sphère de peinture
    const index = paintSpheres.value.indexOf(object)
    if (index !== -1) {
      paintSpheres.value.splice(index, 1)
    }
    
    // Supprimer du tableau s'il s'agit d'un texte
    const textIndex = textElements.value.indexOf(object)
    if (textIndex !== -1) {
      textElements.value.splice(textIndex, 1)
    }
  })
  
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

// Fonction pour effacer une ligne entre deux points
function eraseLineBetween(startPoint, endPoint, steps, size) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = startPoint.x + (endPoint.x - startPoint.x) * t
    const y = startPoint.y + (endPoint.y - startPoint.y) * t
    const z = startPoint.z + (endPoint.z - startPoint.z) * t
    
    const point = new THREE.Vector3(x, y, z)
    eraseAtPoint(point, size)
  }
}

// Ajouter du texte au modèle
function addTextToModel(position, text, color, size) {
  if (!text.trim()) return
  
  // Créer une texture canvas pour le texte
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const fontSize = size // Taille ajustée pour la lisibilité
  
  // Configurer le canvas pour le texte
  canvas.width = text.length * fontSize * 0.8
  canvas.height = fontSize * 1.5
  context.font = `${fontSize}px Arial`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  
  // Fond transparent
  context.clearRect(0, 0, canvas.width, canvas.height)
  
  // Dessiner le texte
  context.fillStyle = color
  context.fillText(text, canvas.width / 2, canvas.height / 2)
  
  // Créer une texture à partir du canvas
  const texture = new THREE.CanvasTexture(canvas)
  
  // Créer un matériau avec la texture
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  })
  
  // Créer un plan pour afficher le texte
  const geometry = new THREE.PlaneGeometry(canvas.width * 0.005, canvas.height * 0.005)
  const textMesh = new THREE.Mesh(geometry, material)
  
  // Positionner le texte
  const direction = new THREE.Vector3()
direction.subVectors(textMesh.position, cameraRef.value.position).normalize()
textMesh.position.add(direction.multiplyScalar(0.01)) // Petit décalage vers la caméra

  textMesh.position.copy(position)
  textMesh.lookAt(cameraRef.value.position) // Orienter vers la caméra
  
  // Ajouter au groupe de canvas
  if (canvasGroup.value) {
    canvasGroup.value.add(textMesh)
  } else {
    sceneRef.value.add(textMesh)
  }
  
  textElements.value.push(textMesh)
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
    powerPreference: 'high-performance',
    alpha: true // Permettre la transparence
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

  // Éclairage
  const light = new THREE.HemisphereLight(0xffffff, 0x444444)
  scene.add(light)
  const dirLight = new THREE.DirectionalLight(0xffffff)
  dirLight.position.set(0, 1, 1).normalize()
  scene.add(dirLight)

  // Créer un groupe pour tous les éléments de dessin
  const group = new THREE.Group()
  canvasGroup.value = group
  scene.add(group)

  // Mur de fond
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
    model.scale.set(1, 1, 1)
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
      
      // Mise à jour de la position de l'aperçu du texte aussi
      if (currentTool.value === 'text') {
        textPreviewX.value = e.clientX
        textPreviewY.value = e.clientY
      }
      
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
      
      // Intersecter avec le modèle
      const intersects = raycaster.intersectObject(model, true)
      
      if (intersects.length > 0) {
        return intersects[0].point
      }
      
      return null
    }

    function interactWithModel(event) {
      // Obtenir le point d'intersection
      const point = getIntersectionPoint(event)
      if (!point) return
      
      const now = Date.now()
      if (now - lastDrawTime.value < drawingThrottleTime.value) return
      lastDrawTime.value = now
      
      // Gérer l'outil actuel
      if (currentTool.value === 'brush') {
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
      } else if (currentTool.value === 'eraser') {
        // Utiliser la fonction améliorée de gomme
        if (!lastPoint.value) {
          eraseAtPoint(point, eraserSize.value)
        } else {
          // Utiliser l'interpolation pour une gomme fluide
          const distance = lastPoint.value.distanceTo(point)
          const steps = Math.ceil(distance / (eraserSize.value * 0.5))
          
          if (steps > 1) {
            eraseLineBetween(lastPoint.value, point, steps, eraserSize.value)
          } else {
            eraseAtPoint(point, eraserSize.value)
          }
        }
      }
    }

    function placeText(event) {
      if (currentTool.value !== 'text') return
      
      const point = getIntersectionPoint(event)
      if (!point) return
      
      addTextToModel(point, textInput.value, textColor.value, textSize.value)
    }

    const handlePointerDown = (e) => {
      if (currentTool.value === 'text') {
        placeText(e)
      } else {
        isDrawing.value = true
        lastPoint.value = null // Réinitialiser le point de départ
        interactWithModel(e)
      }
    }
    
    const handlePointerUp = () => {
      isDrawing.value = false
      lastPoint.value = null // Réinitialiser après avoir terminé
    }
    
    const handlePointerMove = (e) => {
      updateBrushCursor(e)
      if (isDrawing.value) interactWithModel(e)
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
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tool-section {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}
.tool-button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  background: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
.tool-button.active {
  background: #007bff;
  color: white;
  border-color: #0069d9;
}
.tool-icon {
  font-size: 16px;
}
.brush-controls, .text-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.text-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
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
  background: #ffeeee;
}
.clear-button:hover {
  background: #ffe0e0;
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
}
.button {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>