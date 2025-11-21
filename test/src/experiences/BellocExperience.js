/**
 * BellocExperience - Experiència amb custom shape geometry
 * Image tracking amb MindAR i reproducció de vídeo
 */
import { ExperienceManager } from '../core/ExperienceManager.js';
import { ImageTracker } from '../modules/image-tracking/ImageTracker.js';
import { VideoTexture } from '../modules/3d-rendering/VideoTexture.js';
import { GeometryBuilder } from '../modules/3d-rendering/GeometryBuilder.js';
import { MaterialFactory } from '../modules/3d-rendering/MaterialFactory.js';

export class BellocExperience extends ExperienceManager {
  constructor(config) {
    super({ type: 'image-tracking', name: 'Belloc' });
    this.config = config;
    this.tracker = null;
    this.videoTexture = null;
    this.mesh = null;
  }

  async init() {
    await super.init();

    try {
      // Crea el tracker
      this.tracker = new ImageTracker(this.config.assets.target, {
        filterMinCF: 0.8,
        filterBeta: 0.8,
      });

      await this.tracker.init(document.getElementById('ar-container'));

      // Carrega el vídeo
      this.videoTexture = new VideoTexture(this.config.assets.video, {
        loop: true,
        muted: !this.config.audio.enabled || this.config.audio.muted,
        autoplay: false,
      });

      await this.videoTexture.load();

      // Crea la geometria personalitzada
      const geometry = GeometryBuilder.createCustomShape(
        this.config.geometry.points,
        'custom'
      );

      // Crea el material amb la textura del vídeo
      const material = MaterialFactory.createVideoMaterial(
        this.videoTexture.getTexture(),
        { side: THREE.DoubleSide }
      );

      // Crea el mesh
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.scale.set(this.config.scale, this.config.scale, this.config.scale);

      // Afegeix animacions subtils
      this.addAnimations();

      // Afegeix l'anchor
      const anchor = this.tracker.addAnchor(0, this.mesh);

      // Events de target
      this.tracker.onTargetFound(0, () => {
        console.log('Belloc target found');
        this.videoTexture.play();
        this.emit('target-found', { experience: 'belloc' });
      });

      this.tracker.onTargetLost(0, () => {
        console.log('Belloc target lost');
        this.videoTexture.pause();
        this.emit('target-lost', { experience: 'belloc' });
      });

      this.isInitialized = true;
      console.log('BellocExperience initialized');
    } catch (error) {
      console.error('Error initializing BellocExperience:', error);
      throw error;
    }
  }

  /**
   * Afegeix animacions subtils
   */
  addAnimations() {
    if (!this.mesh) return;

    let time = 0;
    const animate = () => {
      if (!this.isRunning) return;

      time += 0.01;

      // Rotació subtil
      this.mesh.rotation.z = Math.sin(time * 0.5) * 0.02;

      // Moviment vertical subtil
      this.mesh.position.y = Math.sin(time) * 0.01;

      requestAnimationFrame(animate);
    };

    animate();
  }

  async start() {
    super.start();

    if (this.tracker) {
      await this.tracker.start();
    }
  }

  stop() {
    super.stop();

    if (this.tracker) {
      this.tracker.stop();
    }

    if (this.videoTexture) {
      this.videoTexture.pause();
    }
  }

  destroy() {
    super.destroy();

    if (this.videoTexture) {
      this.videoTexture.dispose();
    }

    if (this.tracker) {
      this.tracker.destroy();
    }

    if (this.mesh) {
      if (this.mesh.geometry) this.mesh.geometry.dispose();
      if (this.mesh.material) this.mesh.material.dispose();
    }
  }
}
