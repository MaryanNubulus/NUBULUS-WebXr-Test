# NUBULUS WebXR - Architecture Guide

Guia arquitectònica del projecte WebXR modular.

## Visió General

NUBULUS WebXR és una plataforma modular per crear experiències de realitat augmentada (AR) combinant diferents tecnologies:

- **Image Tracking** - MindAR per detecció d'imatges
- **Geolocation** - GPS i orientació del dispositiu
- **3D Rendering** - Three.js per gràfics 3D

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     NUBULUS WebXR App                        │
│                      (main.js)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Image       │ │  Geolocation │ │  Mixed       │
│  Tracking    │ │  Experiences │ │  Experiences │
│  Experiences │ │              │ │              │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌──────────────┐              ┌──────────────┐
│   Core       │              │   Modules    │
│   Classes    │              │              │
│              │              │              │
│ • Experience │              │ • Geolocation│
│   Manager    │              │ • Image      │
│ • Scene      │              │   Tracking   │
│   Manager    │              │ • 3D Render  │
│ • AR Session │              │ • Audio      │
│              │              │ • UI         │
└──────────────┘              └──────────────┘
        │                             │
        └─────────────┬───────────────┘
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
        ┌──────────┐    ┌──────────┐
        │  Utils   │    │  Config  │
        └──────────┘    └──────────┘
```

## Patrons de Disseny

### 1. Herència (Inheritance)

Totes les experiències hereten de `ExperienceManager`:

```javascript
class BellocExperience extends ExperienceManager {
  // Implementació específica
}
```

**Beneficis:**
- Comparteix funcionalitat comuna
- Interfície consistent
- Facilita l'extensió

### 2. Factory Pattern

`MaterialFactory` i `GeometryBuilder` utilitzen el patró Factory:

```javascript
const material = MaterialFactory.createVideoMaterial(texture);
const geometry = GeometryBuilder.createPlane(video, scale);
```

**Beneficis:**
- Creació d'objectes simplificada
- Encapsulació de la lògica de creació

### 3. Observer Pattern (Events)

Sistema d'events per comunicació entre components:

```javascript
experience.on('target-found', (data) => {
  // Reacciona a l'event
});

experience.emit('target-found', { targetId: 0 });
```

**Beneficis:**
- Desacoblament de components
- Comunicació flexible

### 4. Singleton (Opcional)

`Logger` pot utilitzar-se com a singleton global:

```javascript
import { logger } from './utils/Logger.js';
logger.info('Message');
```

### 5. Module Pattern

Utilització d'ES6 modules per organització:

```javascript
// Exportació
export class MyClass { }

// Importació
import { MyClass } from './MyClass.js';
```

## Flux de Dades

### Image Tracking Experience

```
User Action
    │
    ▼
Start Experience
    │
    ▼
ImageTracker.init()
    │
    ├─→ Load Target (.mind file)
    ├─→ Initialize MindAR
    └─→ Setup Camera
    │
    ▼
Create 3D Content
    │
    ├─→ VideoTexture.load()
    ├─→ GeometryBuilder.create()
    └─→ MaterialFactory.create()
    │
    ▼
Add Anchor
    │
    ▼
Start Tracking
    │
    ├─→ Target Found Event
    │   └─→ Play Video
    │
    └─→ Target Lost Event
        └─→ Pause Video
```

### Geolocation Experience

```
User Action
    │
    ▼
Request Permissions
    │
    ├─→ Geolocation
    └─→ Device Orientation
    │
    ▼
Start Trackers
    │
    ├─→ LocationTracker.start()
    │   └─→ watchPosition()
    │
    └─→ OrientationTracker.start()
        └─→ deviceorientation event
    │
    ▼
Update Loop
    │
    ├─→ Check Geofence
    ├─→ Calculate Distance
    └─→ Update UI
```

## Gestió d'Estat

### Estat de l'Experiència

Cada experiència manté el seu estat intern:

```javascript
{
  isInitialized: false,
  isRunning: false,
  type: 'image-tracking',
  name: 'Belloc'
}
```

### Estat Global

L'aplicació principal gestiona l'estat global:

```javascript
class App {
  constructor() {
    this.currentExperience = null;
    this.experiences = new Map();
  }
}
```

## Gestió de Recursos

### Memòria

- **Dispose**: Totes les classes importants tenen un mètode `destroy()` o `dispose()`
- **Cache**: `ModelLoader` implementa cache per models 3D
- **Cleanup**: S'alliberen recursos quan es canvia d'experiència

```javascript
destroy() {
  if (this.videoTexture) this.videoTexture.dispose();
  if (this.mesh) {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
```

### Assets

Els assets s'organitzen en carpetes:

```
assets/
├── models/     # Models 3D (.glb, .gltf)
├── videos/     # Vídeos (.mp4)
├── images/     # Imatges
├── targets/    # MindAR targets (.mind)
└── audio/      # Sons i música
```

## Extensibilitat

### Afegir una Nova Experiència

1. Crea la classe de l'experiència:

```javascript
// src/experiences/NewExperience.js
export class NewExperience extends ExperienceManager {
  async init() { }
  start() { }
  stop() { }
  destroy() { }
}
```

2. Afegeix la configuració:

```javascript
// src/config/experiences.config.js
export const experiencesConfig = {
  newexp: {
    name: 'Nova Experiència',
    type: 'custom',
    // ... configuració
  }
};
```

3. Registra a l'app:

```javascript
// src/main.js
import { NewExperience } from './experiences/NewExperience.js';

registerExperiences() {
  this.experiences.set('newexp', new NewExperience(config));
}
```

### Afegir un Nou Mòdul

1. Crea el mòdul:

```javascript
// src/modules/category/NewModule.js
export class NewModule {
  constructor() { }
  // ... implementació
}
```

2. Exporta i utilitza:

```javascript
import { NewModule } from './modules/category/NewModule.js';
const module = new NewModule();
```

## Optimització

### Performance

1. **Lazy Loading**: Carrega recursos només quan es necessiten
2. **Object Pooling**: Reutilitza objectes 3D quan sigui possible
3. **LOD**: Utilitza Level of Detail per models complexos
4. **Throttling**: Limita actualitzacions de GPS/orientació

### Bundle Size

- **ES Modules**: Permet tree-shaking
- **CDN**: Llibreries externes (Three.js, MindAR) via CDN
- **Code Splitting**: Carrega experiències individualment

## Compatibilitat

### Navegadors Suportats

- Chrome/Edge (Android, Desktop)
- Safari (iOS, macOS)  
- Firefox (Android, Desktop)

### Features Necessàries

- WebGL o WebGL2
- getUserMedia (càmera)
- Geolocation API (experiències GPS)
- DeviceOrientation API (orientació)

### Detecció de Capacitats

```javascript
const capabilities = ARSession.detectCapabilities();
if (!capabilities.webgl) {
  alert('WebGL no suportat');
}
```

## Seguretat

### Permisos

- Sol·licita permisos només quan es necessiten
- Gestiona errors de permisos denegats
- iOS: Necessita permís explícit per DeviceOrientation

### Dades d'Usuari

- No s'emmagatzema ubicació GPS
- Streaming de càmera només local
- No s'envien dades a servidors externs

## Testing (Futur)

### Unit Tests

```javascript
// tests/utils/MathUtils.test.js
describe('MathUtils', () => {
  it('should convert degrees to radians', () => {
    expect(MathUtils.degToRad(180)).toBe(Math.PI);
  });
});
```

### Integration Tests

- Test d'experiències completes
- Mock de permisos i sensors
- Test de transicions entre experiències

## Deployment

### Desenvolupament Local

```bash
npm install
npm run dev
# Obre http://localhost:8080
```

### Producció

1. Puja els fitxers a un servidor HTTPS
2. Configura CORS si cal
3. Optimitza assets (compressió, formats WebP)
4. Activa Service Worker per PWA

## Millores Futures

- [ ] Service Worker per offline support
- [ ] PWA capabilities
- [ ] Web Workers per processos pesats
- [ ] WebXR API per AR nativa
- [ ] Analytics i telemetria
- [ ] CMS per gestionar experiències
- [ ] Multiplayer amb WebRTC
