# NUBULUS WebXR - Projecte Unificat

## 📋 Anàlisi dels Projectes Existents

### 1. **Projecte Belloc** (`/belloc`)

**Tecnologies:**

- MindAR Image Tracking
- Three.js
- Reproducció de vídeo amb textures personalitzades
- Geometria amb ShapeGeometry (polígon irregular)

**Característiques:**

# NUBULUS WebXR - Suite d'Experiències AR guiades per Geolocalització

## ✨ Objectiu

Unificar el desenvolupament de quatre experiències WebXR (Peixos, Belloc, Penelles i Objecte 3D geolocalitzat) sota una arquitectura modular en HTML, CSS i JavaScript per classes. Totes les experiències comparteixen el mateix flux:

1. Obtenir permisos i dades del dispositiu (GPS, orientació, càmera).
2. Comprovar que l'usuari es troba dins la geovalla assignada a l'experiència.
3. Mostrar guies d'orientació fins que l'usuari entri a la geovalla.
4. Activar el contingut específic (MindAR o model 3D) quan la geovalla és vàlida.

## 🔎 Anàlisi dels Projectes Actuals

- **/belloc**: MindAR + Three.js amb vídeo sobre ShapeGeometry personalitzada i control de so.
- **/peixos**: MindAR + Three.js amb PlaneGeometry ajustada automàticament.
- **/penelles**: MindAR + Three.js amb vídeo a escala gran.
- **/3dobjectgeo**: Three.js pur amb model GLTF posicionat per GPS, indicador direccional i càmera de fons.
- **/geolocation**: Prototip modular amb classes per sensors i utils (geofences, orientació, tilt).

L'objectiu és portar la modularitat de `/geolocation` a totes les experiències, de manera que la geovalla sigui condició prèvia comuna abans d'invocar MindAR o el posicionament 3D.

## 🧱 Estructura Modular Recomanada

```
project-root/
├── index.html                     # selector d'experiències
├── README.md
├── src/
│   ├── core/
│   │   ├── BaseExperience.js      # classe abstracta
│   │   ├── GeofenceGate.js        # coordinador geovalla
│   │   ├── SensorSuite.js         # permisos + gestió unificada de sensors
│   │   └── SceneManager.js        # configuració Three.js compartida
│   │
│   ├── modules/
│   │   ├── geolocation/
│   │   │   ├── LocationTracker.js
│   │   │   ├── OrientationTracker.js
│   │   │   ├── GeofenceUtils.js
│   │   │   └── HeadingIndicator.js
│   │   ├── mindar/
│   │   │   ├── MindARController.js
│   │   │   ├── VideoAnchorFactory.js
│   │   │   └── TargetRegistry.js
│   │   ├── rendering/
│   │   │   ├── ModelLoader.js
│   │   │   ├── VideoPlaneBuilder.js
│   │   │   └── MaterialFactory.js
│   │   └── ui/
│   │       ├── StatusPanel.js
│   │       └── PromptManager.js
│   │
│   ├── experiences/
│   │   ├── PeixosExperience.js
│   │   ├── BellocExperience.js
│   │   ├── PenellesExperience.js
│   │   └── Object3DExperience.js
│   │
│   ├── config/
│   │   ├── experiences.config.js
│   │   └── sensors.config.js
│   │
│   └── utils/
│       ├── MathUtils.js
│       ├── PermissionsManager.js
│       └── Logger.js
│
├── assets/
│   ├── models/
│   ├── targets/
│   ├── videos/
│   └── audio/
└── styles/
    ├── main.css
    └── experiences/
```

## 🧠 Flux Global

```
App -> BaseExperience -> GeofenceGate -> (MindAR | Three.js Model)
                       ↘ StatusPanel + HeadingIndicator
```

1. **SensorSuite** demana permisos (GPS, orientació, càmera) i activa `LocationTracker` i `OrientationTracker`.
2. **GeofenceGate** rep les actualitzacions i calcula la distància; informa `StatusPanel` i `HeadingIndicator`.
3. Quan `GeofenceGate` emet `enter`, la classe derivada activa MindAR o el model 3D.
4. En `leave`, el contingut es pausa i es mostra la guia perquè l'usuari torni a entrar.

## 🧩 Classes Core

### `BaseExperience`

```javascript
export class BaseExperience {
  constructor({ id, name, geofence, targetLocation }) {
    this.id = id;
    this.name = name;
    this.geofence = geofence;
    this.targetLocation = targetLocation;
    this.sensorSuite = new SensorSuite();
    this.geofenceGate = new GeofenceGate(geofence);
    this.statusPanel = new StatusPanel("status");
    this.prompt = new PromptManager("prompt");
  }

  async init() {
    await this.sensorSuite.init();
    this.geofenceGate.bindSensors(this.sensorSuite);
    this.bindGeofenceEvents();
    this.setupUI();
  }

  bindGeofenceEvents() {}
  setupUI() {}
  async onEnterGeofence() {}
  async onLeaveGeofence() {}
  destroy() {
    this.sensorSuite.destroy();
  }
}
```

### `GeofenceGate`

```javascript
export class GeofenceGate {
  constructor(polygon) {
    this.polygon = polygon;
    this.isInside = false;
    this.listeners = { enter: [], leave: [], update: [] };
  }

  bindSensors(sensorSuite) {
    sensorSuite.onLocation((location) => this.evaluate(location));
    sensorSuite.onOrientation((orientation) =>
      this.emit("update", { orientation })
    );
  }

  evaluate(location) {
    const result = GeofenceUtils.distanceToPolygon(location, this.polygon);
    if (!this.isInside && result.inside) {
      this.isInside = true;
      this.emit("enter", result);
    } else if (this.isInside && !result.inside) {
      this.isInside = false;
      this.emit("leave", result);
    }
    this.emit("update", result);
  }

  on(event, callback) {
    this.listeners[event].push(callback);
  }
  emit(event, payload) {
    this.listeners[event].forEach((cb) => cb(payload));
  }
}
```

### `SensorSuite`

```javascript
export class SensorSuite {
  constructor() {
    this.locationTracker = new LocationTracker();
    this.orientationTracker = new OrientationTracker();
    this.callbacks = { location: [], orientation: [] };
  }

  async init() {
    await PermissionsManager.request([
      "geolocation",
      "deviceorientation",
      "camera",
    ]);
    this.locationTracker.start({ enableHighAccuracy: true });
    await this.orientationTracker.requestPermission();
    this.orientationTracker.start();

    this.locationTracker.onUpdate((loc) =>
      this.callbacks.location.forEach((cb) => cb(loc))
    );
    this.orientationTracker.onUpdate((ori) =>
      this.callbacks.orientation.forEach((cb) => cb(ori))
    );
  }

  onLocation(cb) {
    this.callbacks.location.push(cb);
  }
  onOrientation(cb) {
    this.callbacks.orientation.push(cb);
  }
  destroy() {
    this.locationTracker.stop();
    this.orientationTracker.stop();
  }
}
```

### `StatusPanel`

```javascript
export class StatusPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    this.container.innerHTML = `
      <h2>Estat</h2>
      <p id="status-geofence">Fora de la geovalla</p>
      <p id="status-distance">Distància: -- m</p>
      <p id="status-heading">Rumb: --°</p>
    `;
  }

  update({ inside, distance, heading }) {
    document.getElementById("status-geofence").textContent = inside
      ? "Dins geovalla"
      : "Fora de la geovalla";
    document.getElementById(
      "status-distance"
    ).textContent = `Distància: ${distance.toFixed(1)} m`;
    document.getElementById(
      "status-heading"
    ).textContent = `Rumb: ${heading.cardinal}`;
  }
}
```

## 🧭 Mecanisme de Geovalla Compartit

- **GeofenceUtils.distanceToPolygon(location, polygon)** retorna `{ inside, distance, heading }`.
- **HeadingIndicator** mostra una fletxa 2D per guiar l'usuari cap a la zona activa.
- Totes les experiències reben events `enter`, `leave`, `update` i actuen en conseqüència.

## 🎬 Experiències Detallades

### 1. `PeixosExperience`

- Tipus: `image-tracking`
- Target: `peixos.mind`
- Geometria: Plane escalat al ratio del vídeo (`VideoPlaneBuilder`).
- Flux:
  1. Espera `enter`.
  2. Crea `MindARController` i `VideoAnchorFactory` per vincular el vídeo.
  3. En `leave`, pausa el vídeo i mostra el prompt de tornada a geovalla.

### 2. `BellocExperience`

- Tipus: `image-tracking`
- Target: `belloc.mind`
- Geometria: Shape personalitzada amb UVs personalitzats.
- Inclou botó d'àudio via `PromptManager`.
- Flux: idèntic al de Peixos però reemplaça la geometria i afegeix `AudioManager`.

### 3. `PenellesExperience`

- Tipus: `image-tracking`
- Target: `penelles.mind`
- Geometria: Plane escalat `1.7`.
- Permet animacions subtils configurables via `VideoAnchorFactory`.

### 4. `Object3DExperience`

- Tipus: `geo-3d`
- Target: model `GLTF`.
- Quan s'entra a la geovalla:
  - Es carrega el model amb `ModelLoader`.
  - Es posiciona en temps real amb `GeofenceUtils.latLonToMeters`.
  - `HeadingIndicator` s'amaga quan la distància és menor que `visibilityDistance`.
- En `leave`, el model s'oculta i torna a mostrar la guia.

## ⚙️ Configuració Central

### `experiences.config.js`

```javascript
export const experiencesConfig = {
  peixos: {
    id: "peixos",
    name: "Experiència Peixos",
    geofence: [...],
    mindar: { target: "./assets/targets/peixos.mind", video: "./assets/videos/peixos.mp4", scale: 0.6 }
  },
  belloc: {
    id: "belloc",
    name: "Experiència Belloc",
    geofence: [...],
    mindar: { target: "./assets/targets/belloc.mind", video: "./assets/videos/belloc.mp4", shape: [...] },
    audio: { src: "./assets/audio/belloc.mp3" }
  },
  penelles: {
    id: "penelles",
    name: "Experiència Penelles",
    geofence: [...],
    mindar: { target: "./assets/targets/penelles.mind", video: "./assets/videos/penelles.mp4", scale: 1.7 }
  },
  object3d: {
    id: "object3d",
    name: "Objecte 3D Geolocalitzat",
    geofence: [...],
    targetLocation: { lat: 41.631736995249575, lon: 0.7782826945720215 },
    model: { path: "./assets/models/test.glb", scale: 5, visibilityDistance: 20 }
  }
};
```

## 🏁 Pseudocodi d'Entranda

```javascript
import { experiencesConfig } from "./config/experiences.config.js";
import {
  PeixosExperience,
  BellocExperience,
  PenellesExperience,
  Object3DExperience,
} from "./experiences/index.js";

const experienceMap = {
  peixos: PeixosExperience,
  belloc: BellocExperience,
  penelles: PenellesExperience,
  object3d: Object3DExperience,
};

async function loadExperience(id) {
  const config = experiencesConfig[id];
  const ExperienceClass = experienceMap[id];
  const experience = new ExperienceClass(config);
  await experience.init();
  await experience.waitForGeofence();
  experience.start();
}

const params = new URLSearchParams(window.location.search);
loadExperience(params.get("exp") || "peixos");
```

`waitForGeofence()` encapsula la subscripció a `GeofenceGate` i resol només quan es rep `enter`.

## 🔄 Comportament Geofence (totes les experiències)

- **Fora**: bloquejar MindAR/Three.js, mostrar missatge i fletxa direccional.
- **Transició a dins**: inicialitzar o reprendre contingut.
- **Dins**: actualitzar distància i rumb en temps real.
- **Sortida**: pausar everything, tornar a mostrar guia.

## 🛠️ Instruments Clau

- `GeofenceUtils`
  - `distanceToPolygon(point, polygon)`
  - `latLonToMeters(userLat, userLon, targetLat, targetLon)`
  - `bearingBetweenPoints(pointA, pointB)`
- `HeadingIndicator`
  - `update(relativeAngle, distance)`
  - `show()` / `hide()`

## ✅ Beneficis

- Reutilització màxima de sensors i flux de geovalla.
- Integració coherent dels quatre projectes.
- Control d'estat centralitzat i fàcil de testejar.
- Experiència d'usuari consistent amb missatges i indicacions unificades.

## 📌 Properes Tasques

- Implementar `GeofenceGate` i `SensorSuite` compartits.
- Migrar cada experiència perquè extengui `BaseExperience`.
- Crear UI neutra (`StatusPanel`, `PromptManager`, `HeadingIndicator`).
- Validar permisos i compatibilitat (iOS/Android) per sensors i càmera.
- Escriure tests unitàris per `GeofenceUtils`.
- Documentar API per experiència a `docs/`.

---

**Autor**: NUBULUS Team  
**Versió**: 2.0.0  
**Llicència**: MIT

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
