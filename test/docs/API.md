# NUBULUS WebXR - API Reference

Documentació de l'API del projecte WebXR modular.

## Core Classes

### ExperienceManager

Classe base abstracta per a totes les experiències.

```javascript
import { ExperienceManager } from './core/ExperienceManager.js';

class MyExperience extends ExperienceManager {
  constructor(config) {
    super({ type: 'image-tracking', name: 'MyExperience' });
  }
}
```

**Mètodes:**
- `async init()` - Inicialitza l'experiència
- `start()` - Inicia l'experiència
- `stop()` - Atura l'experiència
- `destroy()` - Destrueix l'experiència i allibera recursos
- `on(eventName, callback)` - Registra un listener per un event
- `emit(eventName, data)` - Emet un event

### SceneManager

Gestió de Three.js scene, camera i renderer.

```javascript
import { SceneManager } from './core/SceneManager.js';

const sceneManager = new SceneManager(threeConfig);
sceneManager.addObject(mesh);
sceneManager.startAnimation();
```

**Mètodes:**
- `addObject(object)` - Afegeix objecte a l'escena
- `removeObject(object)` - Elimina objecte
- `onAnimate(callback)` - Registra callback per al loop
- `startAnimation()` - Inicia el loop
- `stopAnimation()` - Atura el loop

### ARSession

Gestió de permisos AR.

```javascript
import { ARSession } from './core/ARSession.js';

const session = new ARSession();
await session.requestPermissions();
session.start();
```

## Modules

### Geolocation

#### LocationTracker

```javascript
import { LocationTracker } from './modules/geolocation/LocationTracker.js';

const tracker = new LocationTracker();
tracker.start({ enableHighAccuracy: true });
tracker.onUpdate((position) => {
  console.log(position.lat, position.lon);
});
```

#### OrientationTracker

```javascript
import { OrientationTracker } from './modules/geolocation/OrientationTracker.js';

const tracker = new OrientationTracker();
await tracker.requestPermission();
tracker.start();
tracker.onUpdate((orientation) => {
  console.log(orientation.alpha, orientation.cardinal);
});
```

#### GeofenceUtils

```javascript
import { GeofenceUtils } from './modules/geolocation/GeofenceUtils.js';

const distance = GeofenceUtils.haversineDistance(lat1, lon1, lat2, lon2);
const inside = GeofenceUtils.isInsidePolygon(point, polygon);
```

### Image Tracking

#### ImageTracker

```javascript
import { ImageTracker } from './modules/image-tracking/ImageTracker.js';

const tracker = new ImageTracker('./assets/targets/target.mind');
await tracker.init(container);
const anchor = tracker.addAnchor(0, mesh);
await tracker.start();
```

### 3D Rendering

#### ModelLoader

```javascript
import { ModelLoader } from './modules/3d-rendering/ModelLoader.js';

const loader = new ModelLoader();
const model = await loader.loadGLTF('./assets/models/model.glb');
scene.add(model);
```

#### VideoTexture

```javascript
import { VideoTexture } from './modules/3d-rendering/VideoTexture.js';

const videoTexture = new VideoTexture('./assets/videos/video.mp4');
await videoTexture.load();
const texture = videoTexture.getTexture();
videoTexture.play();
```

#### GeometryBuilder

```javascript
import { GeometryBuilder } from './modules/3d-rendering/GeometryBuilder.js';

const plane = GeometryBuilder.createPlaneWithAspectRatio(video, 1.0);
const customShape = GeometryBuilder.createCustomShape(points);
```

#### MaterialFactory

```javascript
import { MaterialFactory } from './modules/3d-rendering/MaterialFactory.js';

const material = MaterialFactory.createVideoMaterial(texture);
const basicMaterial = MaterialFactory.createBasicMaterial({ color: 0xff0000 });
```

### Audio

#### AudioManager

```javascript
import { AudioManager } from './modules/audio/AudioManager.js';

const audioManager = new AudioManager();
await audioManager.init();
await audioManager.loadSound('bgm', './assets/audio/music.mp3');
audioManager.play('bgm', { loop: true });
```

### UI

#### StatusDisplay

```javascript
import { StatusDisplay } from './modules/ui/StatusDisplay.js';

const status = new StatusDisplay();
status.create();
status.addElement('fps', 'FPS', '60');
status.update('fps', '55');
```

#### ControlPanel

```javascript
import { ControlPanel } from './modules/ui/ControlPanel.js';

const panel = new ControlPanel();
panel.create();
panel.addButton('start', 'Start', () => console.log('Started'));
panel.addSlider('volume', 'Volume', 0, 1, 0.5, (value) => {
  audioManager.setMasterVolume(value);
});
```

#### LoadingScreen

```javascript
import { LoadingScreen } from './modules/ui/LoadingScreen.js';

const loading = new LoadingScreen();
loading.show('Loading...');
loading.updateProgress(50);
loading.hide();
```

## Utils

### MathUtils

```javascript
import { MathUtils } from './utils/MathUtils.js';

const rad = MathUtils.degToRad(90);
const value = MathUtils.lerp(0, 100, 0.5); // 50
const clamped = MathUtils.clamp(150, 0, 100); // 100
```

### PermissionsManager

```javascript
import { PermissionsManager } from './utils/PermissionsManager.js';

const pm = new PermissionsManager();
await pm.requestCamera();
await pm.requestGeolocation();
const granted = pm.hasAllPermissions(['camera', 'geolocation']);
```

### DeviceDetector

```javascript
import { DeviceDetector } from './utils/DeviceDetector.js';

const detector = new DeviceDetector();
const info = detector.getInfo();
console.log(info.os, info.browser, info.device);
```

### Logger

```javascript
import { Logger, logger } from './utils/Logger.js';

logger.info('App started');
logger.debug('Debug info');
logger.warn('Warning');
logger.error('Error occurred');

const customLogger = new Logger('MyModule', Logger.LEVELS.DEBUG);
```

## Configuration

### experiences.config.js

```javascript
import { experiencesConfig, getExperienceConfig } from './config/experiences.config.js';

const config = getExperienceConfig('belloc');
console.log(config.assets.video);
```

### three.config.js

```javascript
import { threeConfig, getThreeConfig } from './config/three.config.js';

const config = getThreeConfig();
const renderer = new THREE.WebGLRenderer(config.renderer);
```

### constants.js

```javascript
import { VERSION, PATHS, EVENTS, AR_CONFIG } from './config/constants.js';

console.log('App version:', VERSION);
console.log('Models path:', PATHS.MODELS);
```

## Events

El sistema d'events permet la comunicació entre components:

```javascript
// Emetre event
experience.emit('custom-event', { data: 'value' });

// Escoltar event
experience.on('custom-event', (data) => {
  console.log(data);
});
```

**Events predefinits:**
- `target-found` - Image target detectat
- `target-lost` - Image target perdut
- `location-update` - Actualització de ubicació GPS
- `orientation-update` - Actualització d'orientació
- `geofence-enter` - Entrada a geofence
- `geofence-exit` - Sortida de geofence

## Exemples

### Crear una Experiència Personalitzada

```javascript
import { ExperienceManager } from './core/ExperienceManager.js';
import { ImageTracker } from './modules/image-tracking/ImageTracker.js';

export class CustomExperience extends ExperienceManager {
  constructor(config) {
    super({ type: 'image-tracking', name: 'Custom' });
    this.config = config;
  }

  async init() {
    await super.init();
    
    this.tracker = new ImageTracker(this.config.target);
    await this.tracker.init(document.getElementById('ar-container'));
    
    // Afegeix el teu contingut aquí
    
    this.isInitialized = true;
  }

  async start() {
    super.start();
    await this.tracker.start();
  }

  stop() {
    super.stop();
    this.tracker.stop();
  }

  destroy() {
    super.destroy();
    this.tracker.destroy();
  }
}
```
