/**
 * Object3DGeoExperience - Models 3D posicionats per GPS
 * Càmera de fons amb vídeo i indicador direccional
 */
import { ExperienceManager } from '../core/ExperienceManager.js';
import { SceneManager } from '../core/SceneManager.js';
import { LocationTracker } from '../modules/geolocation/LocationTracker.js';
import { OrientationTracker } from '../modules/geolocation/OrientationTracker.js';
import { ModelLoader } from '../modules/3d-rendering/ModelLoader.js';
import { GeofenceUtils } from '../modules/geolocation/GeofenceUtils.js';

export class Object3DGeoExperience extends ExperienceManager {
  constructor(config) {
    super({ type: 'mixed', name: '3D Geo Object' });
    this.config = config;
    
    this.locationTracker = new LocationTracker();
    this.orientationTracker = new OrientationTracker();
    this.modelLoader = new ModelLoader();
    this.sceneManager = null;
    
    this.model = null;
    this.indicator = null;
    this.videoBackground = null;
  }

  async init() {
    await super.init();

    try {
      // Crea la scene
      this.sceneManager = new SceneManager();
      const container = document.getElementById('ar-container');
      if (container) {
        container.appendChild(this.sceneManager.renderer.domElement);
      }

      // Configura càmera de fons amb vídeo
      await this.setupBackgroundCamera();

      // Carrega el model 3D
      this.model = await this.modelLoader.loadGLTF(this.config.assets.model);
      this.model.scale.set(
        this.config.modelScale,
        this.config.modelScale,
        this.config.modelScale
      );
      this.model.visible = false; // Invisible fins que estigui dins del rang

      this.sceneManager.addObject(this.model);

      // Crea indicador direccional
      if (this.config.indicator.enabled) {
        this.createDirectionalIndicator();
      }

      // Inicia tracking
      this.locationTracker.start(this.config.tracking);
      await this.orientationTracker.requestPermission();
      this.orientationTracker.start();

      // Inicia animació
      this.sceneManager.onAnimate(() => this.update());
      this.sceneManager.startAnimation();

      // Window resize
      window.addEventListener('resize', () => {
        this.sceneManager.onWindowResize();
      });

      this.isInitialized = true;
      console.log('Object3DGeoExperience initialized');
    } catch (error) {
      console.error('Error initializing Object3DGeoExperience:', error);
      throw error;
    }
  }

  async setupBackgroundCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;

      // Crea un plane de fons
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.MeshBasicMaterial({ map: videoTexture });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.z = -10;

      this.sceneManager.addObject(plane);
      this.videoBackground = { video, plane };

      console.log('Background camera setup complete');
    } catch (error) {
      console.error('Error setting up background camera:', error);
    }
  }

  createDirectionalIndicator() {
    const geometry = new THREE.ConeGeometry(
      this.config.indicator.size,
      this.config.indicator.size * 2,
      8
    );
    const material = new THREE.MeshBasicMaterial({
      color: this.config.indicator.color
    });
    
    this.indicator = new THREE.Mesh(geometry, material);
    this.indicator.position.set(0, -2, -5); // Posició a la part inferior de la pantalla
    this.indicator.rotation.x = Math.PI / 2; // Apunta endavant

    this.sceneManager.addObject(this.indicator);
  }

  update() {
    const position = this.locationTracker.currentPosition;
    const alpha = this.orientationTracker.alpha;

    if (position && this.model) {
      // Converteix coordenades GPS a metres
      const meters = GeofenceUtils.latLonToMeters(
        position.lat, position.lon,
        this.config.targetLocation.lat, this.config.targetLocation.lon
      );

      // Posiciona el model
      this.model.position.x = meters.x;
      this.model.position.z = -meters.z; // Z negatiu perquè la càmera mira cap endavant

      // Calcula distància
      const distance = Math.sqrt(meters.x ** 2 + meters.z ** 2);

      // Mostra/amaga el model segons la distància
      this.model.visible = distance <= this.config.visibilityDistance;

      // Calcula bearing i actualitza indicador
      if (this.indicator) {
        const bearing = Math.atan2(meters.x, meters.z) * (180 / Math.PI);
        const relativeAngle = bearing - alpha;

        this.indicator.rotation.z = -relativeAngle * Math.PI / 180;
        this.indicator.visible = !this.model.visible; // Només visible si model no és visible
      }

      // Rotació suau del model
      if (this.model.visible) {
        this.model.rotation.y += 0.01;
      }
    }
  }

  start() {
    super.start();
  }

  stop() {
    super.stop();
    this.locationTracker.stop();
    this.orientationTracker.stop();
    this.sceneManager.stopAnimation();

    if (this.videoBackground && this.videoBackground.video) {
      this.videoBackground.video.srcObject.getTracks().forEach(track => track.stop());
    }
  }

  destroy() {
    super.destroy();
    this.locationTracker.stop();
    this.orientationTracker.stop();
    
    if (this.sceneManager) {
      this.sceneManager.destroy();
    }

    if (this.videoBackground && this.videoBackground.video) {
      this.videoBackground.video.srcObject.getTracks().forEach(track => track.stop());
    }
  }
}
