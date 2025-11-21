# NUBULUS WebXR - Projecte Unificat

## 📋 Anàlisi dels Projectes Existents

### 1. **Projecte Belloc** (`/belloc`)

**Tecnologies:**

- MindAR Image Tracking
- Three.js
- Reproducció de vídeo amb textures personalitzades
- Geometria amb ShapeGeometry (polígon irregular)

**Característiques:**

- Detecció d'imatge amb targets.mind
- Reproducció de vídeo sobre geometria personalitzada
- Control d'àudio (botó per activar so)
- Animacions subtils (rotació i moviment vertical)
- Mapeig UV manual per coordenades personalitzades

---

### 2. **Projecte Peixos** (`/peixos`)

**Tecnologies:**

- MindAR Image Tracking
- Three.js
- Reproducció de vídeo amb PlaneGeometry

**Característiques:**

- Detecció d'imatge amb targets.mind
- Pla amb aspect ratio ajustat automàticament
- Escala: `videoRatio * 0.6`
- Animacions subtils simples

---

### 3. **Projecte Penelles** (`/penelles`)

**Tecnologies:**

- MindAR Image Tracking
- Three.js
- Reproducció de vídeo amb PlaneGeometry

**Característiques:**

- Detecció d'imatge amb targets.mind
- Pla amb aspect ratio ajustat automàticament
- Escala: `videoRatio * 1.7` (més gran que Peixos)
- Animacions subtils

---

### 4. **Projecte Geolocation** (`/geolocation`)

**Tecnologies:**

- Arquitectura modular amb classes ES6
- Geolocalització (watchPosition)
- Device Orientation API
- Screen Orientation Detection
- Algoritmes de comparació (geofencing, orientació, tilt)

**Mòduls:**

- `CurrentDeviceInfo.js` - Gestió de sensors del dispositiu
- `CurrentExperienceInfo.js` - Configuració de l'experiència
- `ComparisonUtils.js` - Utilitats de càlcul (Haversine, point-in-polygon)
- `main.js` - Orquestrador principal

**Característiques:**

- Sistema de geovalla (polygon geofencing)
- Detecció d'orientació cardinal (N, NE, E, etc.)
- Normalització de tilt (beta/gamma)
- Comparació en temps real
- Gestió de permisos iOS

---

### 5. **Projecte 3D Object Geo** (`/3dobjectgeo`)

**Tecnologies:**

- Three.js
- GLTFLoader
- Geolocalització contínua (watchPosition)
- Device Orientation API
- Video Background

**Característiques:**

- Càmera de fons amb textura de vídeo
- Càrrega de models 3D (.glb)
- Posicionament d'objectes segons coordenades GPS
- Conversió lat/lon a metres (Haversine)
- Indicador direccional (fletxa que apunta a l'objecte)
- Distància de visibilitat configurable (20m)
- Actualització contínua de posició

---

## 🏗️ Arquitectura Proposada - Projecte Modular

### Estructura de Carpetes

```
project-root/
│
├── index.html                    # Selector d'experiències
├── README.md
├── package.json
│
├── src/
│   ├── core/                     # Classes base
│   │   ├── ExperienceManager.js
│   │   ├── SceneManager.js
│   │   └── ARSession.js
│   │
│   ├── modules/                  # Mòduls funcionals
│   │   ├── geolocation/
│   │   │   ├── DeviceInfo.js
│   │   │   ├── LocationTracker.js
│   │   │   ├── OrientationTracker.js
│   │   │   └── GeofenceUtils.js
│   │   │
│   │   ├── image-tracking/
│   │   │   ├── ImageTracker.js
│   │   │   ├── TargetManager.js
│   │   │   └── AnchorManager.js
│   │   │
│   │   ├── 3d-rendering/
│   │   │   ├── ModelLoader.js
│   │   │   ├── VideoTexture.js
│   │   │   ├── GeometryBuilder.js
│   │   │   └── MaterialFactory.js
│   │   │
│   │   ├── audio/
│   │   │   ├── AudioManager.js
│   │   │   └── SpatialAudio.js
│   │   │
│   │   └── ui/
│   │       ├── StatusDisplay.js
│   │       ├── ControlPanel.js
│   │       └── LoadingScreen.js
│   │
│   ├── experiences/              # Experiències individuals
│   │   ├── BellocExperience.js
│   │   ├── PeixosExperience.js
│   │   ├── PenellesExperience.js
│   │   ├── GeolocationExperience.js
│   │   └── Object3DGeoExperience.js
│   │
│   ├── utils/                    # Utilitats generals
│   │   ├── MathUtils.js
│   │   ├── PermissionsManager.js
│   │   ├── DeviceDetector.js
│   │   └── Logger.js
│   │
│   └── config/                   # Configuracions
│       ├── experiences.config.js
│       ├── three.config.js
│       └── constants.js
│
├── assets/                       # Recursos estàtics
│   ├── models/
│   ├── videos/
│   ├── images/
│   ├── targets/
│   └── audio/
│
├── styles/
│   ├── main.css
│   ├── components/
│   └── experiences/
│
└── docs/
    ├── API.md
    └── ARCHITECTURE.md
```

---

## 🔧 Classes Base

### 1. **ExperienceManager** (Core)

```javascript
export class ExperienceManager {
  constructor(config) {
    this.type = config.type; // 'image-tracking', 'geolocation', 'mixed'
    this.scene = null;
    this.renderer = null;
    this.camera = null;
  }

  async init() {}
  start() {}
  stop() {}
  destroy() {}
}
```

### 2. **SceneManager** (Core)

```javascript
export class SceneManager {
  constructor(threeConfig) {
    this.scene = new THREE.Scene();
    this.camera = this.createCamera(threeConfig);
    this.renderer = this.createRenderer(threeConfig);
  }

  createCamera(config) {}
  createRenderer(config) {}
  addObject(object) {}
  removeObject(object) {}
  animate() {}
}
```

### 3. **ARSession** (Core)

```javascript
export class ARSession {
  constructor() {
    this.isActive = false;
    this.permissions = {
      camera: false,
      location: false,
      orientation: false,
    };
  }

  async requestPermissions() {}
  start() {}
  stop() {}
}
```

---

## 📦 Mòduls Funcionals

### **Geolocation Module**

#### `DeviceInfo.js`

```javascript
export class DeviceInfo {
  constructor() {
    this.location = { lat: null, lon: null, accuracy: null };
    this.orientation = { alpha: 0, beta: 0, gamma: 0, cardinal: "N" };
    this.screen = { mode: "portrait", width: 0, height: 0 };
  }

  async init() {}
  startTracking() {}
  stopTracking() {}
  getSnapshot() {}
}
```

#### `LocationTracker.js`

```javascript
export class LocationTracker {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
    this.callbacks = [];
  }

  start(options = {}) {}
  stop() {}
  onUpdate(callback) {}
  getDistance(lat, lon) {}
}
```

#### `OrientationTracker.js`

```javascript
export class OrientationTracker {
  constructor() {
    this.alpha = 0; // compass
    this.beta = 0; // tilt front-back
    this.gamma = 0; // tilt left-right
    this.callbacks = [];
  }

  async requestPermission() {}
  start() {}
  stop() {}
  onUpdate(callback) {}
  getCardinalDirection() {}
}
```

#### `GeofenceUtils.js`

```javascript
export class GeofenceUtils {
  static isInsidePolygon(point, polygon) {}
  static haversineDistance(lat1, lon1, lat2, lon2) {}
  static bearingTo(lat1, lon1, lat2, lon2) {}
  static createCircleGeofence(center, radius, points = 32) {}
}
```

---

### **Image Tracking Module**

#### `ImageTracker.js`

```javascript
export class ImageTracker {
  constructor(targetSrc, config = {}) {
    this.targetSrc = targetSrc;
    this.mindarThree = null;
    this.anchors = [];
    this.config = {
      filterMinCF: 0.8,
      filterBeta: 0.8,
      ...config,
    };
  }

  async init(container) {}
  addAnchor(index, content) {}
  start() {}
  stop() {}
}
```

#### `TargetManager.js`

```javascript
export class TargetManager {
  constructor() {
    this.targets = new Map();
    this.activeTargets = new Set();
  }

  loadTarget(id, path) {}
  getTarget(id) {}
  onTargetFound(id, callback) {}
  onTargetLost(id, callback) {}
}
```

---

### **3D Rendering Module**

#### `ModelLoader.js`

```javascript
export class ModelLoader {
  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.fbxLoader = null; // lazy load
    this.cache = new Map();
  }

  async loadGLTF(path) {}
  async loadFBX(path) {}
  getFromCache(path) {}
  clearCache() {}
}
```

#### `VideoTexture.js`

```javascript
export class VideoTexture {
  constructor(videoSrc, options = {}) {
    this.video = document.createElement("video");
    this.texture = null;
    this.options = {
      loop: true,
      muted: true,
      autoplay: false,
      ...options,
    };
  }

  async load() {}
  play() {}
  pause() {}
  getTexture() {}
  dispose() {}
}
```

#### `GeometryBuilder.js`

```javascript
export class GeometryBuilder {
  static createPlaneWithAspectRatio(video, scale = 1) {}
  static createCustomShape(points, uvMapping = "automatic") {}
  static createSphere(radius, segments) {}
}
```

#### `MaterialFactory.js`

```javascript
export class MaterialFactory {
  static createVideoMaterial(texture, options = {}) {}
  static createBasicMaterial(options) {}
  static createStandardMaterial(options) {}
}
```

---

### **Audio Module**

#### `AudioManager.js`

```javascript
export class AudioManager {
  constructor() {
    this.context = null;
    this.sounds = new Map();
    this.isMuted = false;
  }

  async init() {}
  loadSound(id, path) {}
  play(id, options = {}) {}
  stop(id) {}
  mute() {}
  unmute() {}
}
```

#### `SpatialAudio.js`

```javascript
export class SpatialAudio {
  constructor(audioManager) {
    this.manager = audioManager;
    this.listener = null;
  }

  create3DSound(id, position) {}
  updateListenerPosition(position, orientation) {}
}
```

---

### **UI Module**

#### `StatusDisplay.js`

```javascript
export class StatusDisplay {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.elements = {};
  }

  create() {}
  update(key, value) {}
  show() {}
  hide() {}
}
```

#### `ControlPanel.js`

```javascript
export class ControlPanel {
  constructor() {
    this.buttons = new Map();
    this.sliders = new Map();
  }

  addButton(id, label, callback) {}
  addSlider(id, label, min, max, callback) {}
  show() {}
  hide() {}
}
```

---

## 🎯 Exemples d'Experiències

### **BellocExperience.js**

```javascript
import { ExperienceManager } from "../core/ExperienceManager.js";
import { ImageTracker } from "../modules/image-tracking/ImageTracker.js";
import { VideoTexture } from "../modules/3d-rendering/VideoTexture.js";
import { GeometryBuilder } from "../modules/3d-rendering/GeometryBuilder.js";

export class BellocExperience extends ExperienceManager {
  constructor() {
    super({ type: "image-tracking", name: "Belloc" });
    this.tracker = null;
    this.videoTexture = null;
  }

  async init() {
    this.tracker = new ImageTracker("./assets/targets/belloc.mind");
    await this.tracker.init(document.getElementById("ar-container"));

    this.videoTexture = new VideoTexture("./assets/videos/belloc.mp4");
    await this.videoTexture.load();

    const customShape = GeometryBuilder.createCustomShape([
      { x: 0.51, y: 0.11 },
      { x: 0.98, y: 0.42 },
      { x: 0.99, y: 0.91 },
      { x: 0.01, y: 0.9 },
      { x: 0.03, y: 0.41 },
    ]);

    const anchor = this.tracker.addAnchor(0, {
      geometry: customShape,
      texture: this.videoTexture.getTexture(),
      scale: 0.45,
    });

    this.tracker.start();
  }
}
```

### **GeolocationExperience.js**

```javascript
import { ExperienceManager } from "../core/ExperienceManager.js";
import { LocationTracker } from "../modules/geolocation/LocationTracker.js";
import { OrientationTracker } from "../modules/geolocation/OrientationTracker.js";
import { GeofenceUtils } from "../modules/geolocation/GeofenceUtils.js";

export class GeolocationExperience extends ExperienceManager {
  constructor(config) {
    super({ type: "geolocation", name: "Geolocation" });
    this.locationTracker = new LocationTracker();
    this.orientationTracker = new OrientationTracker();
    this.geofence = config.geofence;
    this.targetOrientation = config.targetOrientation;
  }

  async init() {
    await this.orientationTracker.requestPermission();

    this.locationTracker.start();
    this.orientationTracker.start();

    this.locationTracker.onUpdate((position) => {
      this.checkGeofence(position);
    });

    this.orientationTracker.onUpdate((orientation) => {
      this.checkOrientation(orientation);
    });
  }

  checkGeofence(position) {
    const result = GeofenceUtils.isInsidePolygon(position, this.geofence);
    this.emit("geofence-check", result);
  }

  checkOrientation(orientation) {
    const cardinal = this.orientationTracker.getCardinalDirection();
    this.emit("orientation-update", { orientation, cardinal });
  }
}
```

### **Object3DGeoExperience.js**

```javascript
import { ExperienceManager } from "../core/ExperienceManager.js";
import { LocationTracker } from "../modules/geolocation/LocationTracker.js";
import { OrientationTracker } from "../modules/geolocation/OrientationTracker.js";
import { ModelLoader } from "../modules/3d-rendering/ModelLoader.js";
import { GeofenceUtils } from "../modules/geolocation/GeofenceUtils.js";

export class Object3DGeoExperience extends ExperienceManager {
  constructor(config) {
    super({ type: "mixed", name: "3D Geo Object" });
    this.targetLocation = config.targetLocation;
    this.modelPath = config.modelPath;
    this.visibilityDistance = config.visibilityDistance || 20;

    this.locationTracker = new LocationTracker();
    this.orientationTracker = new OrientationTracker();
    this.modelLoader = new ModelLoader();
    this.model = null;
  }

  async init() {
    await super.init();

    this.model = await this.modelLoader.loadGLTF(this.modelPath);
    this.model.scale.set(5, 5, 5);
    this.scene.add(this.model);

    this.locationTracker.start({ enableHighAccuracy: true });
    await this.orientationTracker.requestPermission();
    this.orientationTracker.start();

    this.setupBackgroundCamera();
  }

  animate() {
    const position = this.locationTracker.currentPosition;
    const orientation = this.orientationTracker.alpha;

    if (position && this.model) {
      const meters = this.latLonToMeters(
        position.lat,
        position.lon,
        this.targetLocation.lat,
        this.targetLocation.lon
      );

      this.model.position.x = meters.x;
      this.model.position.z = -meters.z;

      const distance = Math.sqrt(meters.x ** 2 + meters.z ** 2);
      this.model.visible = distance <= this.visibilityDistance;

      const bearing = Math.atan2(meters.x, meters.z) * (180 / Math.PI);
      const relativeAngle = bearing - orientation;

      this.updateIndicator(relativeAngle, this.model.visible);
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }

  latLonToMeters(userLat, userLon, objLat, objLon) {
    const R = 6371000;
    const dLat = ((objLat - userLat) * Math.PI) / 180;
    const dLon = ((objLon - userLon) * Math.PI) / 180;
    const latRad = (userLat * Math.PI) / 180;
    const x = dLon * R * Math.cos(latRad);
    const z = dLat * R;
    return { x, z };
  }
}
```

---

## 🔌 Configuració d'Experiències

### `experiences.config.js`

```javascript
export const experiencesConfig = {
  belloc: {
    name: "Experiència Belloc",
    type: "image-tracking",
    target: "./assets/targets/belloc.mind",
    video: "./assets/videos/belloc.mp4",
    geometry: "custom-shape",
    scale: 0.45,
    customShape: [
      { x: 0.51, y: 0.11 },
      { x: 0.98, y: 0.42 },
      { x: 0.99, y: 0.91 },
      { x: 0.01, y: 0.9 },
      { x: 0.03, y: 0.41 },
    ],
  },

  peixos: {
    name: "Experiència Peixos",
    type: "image-tracking",
    target: "./assets/targets/peixos.mind",
    video: "./assets/videos/peixos.mp4",
    geometry: "plane",
    scale: 0.6,
  },

  penelles: {
    name: "Experiència Penelles",
    type: "image-tracking",
    target: "./assets/targets/penelles.mind",
    video: "./assets/videos/penelles.mp4",
    geometry: "plane",
    scale: 1.7,
  },

  geolocation: {
    name: "Experiència Geolocalització",
    type: "geolocation",
    targetLocation: { lat: 41.231, lon: 1.123 },
    targetOrientation: 120,
    geofence: [
      { lat: 41.23, lon: 1.12 },
      { lat: 41.24, lon: 1.12 },
      { lat: 41.24, lon: 1.13 },
      { lat: 41.23, lon: 1.13 },
    ],
  },

  object3dgeo: {
    name: "Experiència 3D Geolocalització",
    type: "mixed",
    targetLocation: { lat: 41.631736995249575, lon: 0.7782826945720215 },
    modelPath: "./assets/models/test.glb",
    visibilityDistance: 20,
  },
};
```

---

## 🚀 Implementació

### **main.js** (Punt d'entrada)

```javascript
import { BellocExperience } from "./experiences/BellocExperience.js";
import { PeixosExperience } from "./experiences/PeixosExperience.js";
import { PenellesExperience } from "./experiences/PenellesExperience.js";
import { GeolocationExperience } from "./experiences/GeolocationExperience.js";
import { Object3DGeoExperience } from "./experiences/Object3DGeoExperience.js";
import { experiencesConfig } from "./config/experiences.config.js";

class App {
  constructor() {
    this.currentExperience = null;
    this.experiences = new Map();
  }

  registerExperiences() {
    this.experiences.set(
      "belloc",
      new BellocExperience(experiencesConfig.belloc)
    );
    this.experiences.set(
      "peixos",
      new PeixosExperience(experiencesConfig.peixos)
    );
    this.experiences.set(
      "penelles",
      new PenellesExperience(experiencesConfig.penelles)
    );
    this.experiences.set(
      "geolocation",
      new GeolocationExperience(experiencesConfig.geolocation)
    );
    this.experiences.set(
      "object3dgeo",
      new Object3DGeoExperience(experiencesConfig.object3dgeo)
    );
  }

  async loadExperience(id) {
    if (this.currentExperience) {
      await this.currentExperience.stop();
      this.currentExperience.destroy();
    }

    const experience = this.experiences.get(id);
    if (experience) {
      this.currentExperience = experience;
      await experience.init();
      experience.start();
    }
  }

  init() {
    this.registerExperiences();

    // Detectar experiència des de URL o selector
    const urlParams = new URLSearchParams(window.location.search);
    const experienceId = urlParams.get("exp");

    if (experienceId) {
      this.loadExperience(experienceId);
    }
  }
}

const app = new App();
app.init();
```

---

## 📱 Tecnologies Integrades

| Tecnologia                 | Ús                | Projectes                               |
| -------------------------- | ----------------- | --------------------------------------- |
| **Three.js**               | Motor 3D          | Tots                                    |
| **MindAR**                 | Image tracking    | Belloc, Peixos, Penelles                |
| **Geolocation API**        | GPS tracking      | Geolocation, 3DObjectGeo                |
| **Device Orientation API** | Compass/Sensors   | Geolocation, 3DObjectGeo                |
| **WebGL**                  | Renderització     | Tots                                    |
| **ES6 Modules**            | Modularitat       | Geolocation (actual), Proposat per tots |
| **GLTFLoader**             | Càrrega models 3D | 3DObjectGeo                             |
| **VideoTexture**           | Vídeo com textura | Belloc, Peixos, Penelles                |

---

## 🎯 Avantatges de l'Arquitectura Modular

1. **Reutilització de codi**: Els mòduls es poden compartir entre experiències
2. **Mantenibilitat**: Cada mòdul té una responsabilitat clara
3. **Escalabilitat**: Fàcil afegir noves experiències
4. **Testing**: Es poden testejar mòduls individualment
5. **Col·laboració**: Diferents desenvolupadors poden treballar en mòduls diferents
6. **Optimització**: Lazy loading de mòduls no utilitzats

---

## 📚 Pròxims Passos

1. ✅ Crear l'estructura de carpetes
2. ✅ Implementar classes base (Core)
3. ✅ Migrar funcionalitats existents a mòduls
4. ✅ Crear configuracions centralitzades
5. ✅ Implementar sistema de càrrega d'experiències
6. ✅ Afegir sistema d'events per comunicació entre mòduls
7. ✅ Documentar API de cada mòdul
8. ✅ Crear exemples d'ús
9. ✅ Optimitzar rendiment i bundle size

---

## 📖 Documentació Addicional

- [API Reference](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

**Autor**: NUBULUS Team  
**Versió**: 1.0.0  
**Llicència**: MIT
