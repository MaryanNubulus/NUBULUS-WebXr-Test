/**
 * PenellesExperience - Experiència amb plane geometry gran
 * Image tracking amb MindAR i vídeo
 */
import { ExperienceManager } from '../core/ExperienceManager.js';
import { ImageTracker } from '../modules/image-tracking/ImageTracker.js';
import { VideoTexture } from '../modules/3d-rendering/VideoTexture.js';
import { GeometryBuilder } from '../modules/3d-rendering/GeometryBuilder.js';
import { MaterialFactory } from '../modules/3d-rendering/MaterialFactory.js';

export class PenellesExperience extends ExperienceManager {
  constructor(config) {
    super({ type: 'image-tracking', name: 'Penelles' });
    this.config = config;
    this.tracker = null;
    this.videoTexture = null;
    this.mesh = null;
  }

  async init() {
    await super.init();

    try {
      this.tracker = new ImageTracker(this.config.assets.target);
      await this.tracker.init(document.getElementById('ar-container'));

      this.videoTexture = new VideoTexture(this.config.assets.video, {
        loop: true,
        muted: this.config.audio.muted,
      });

      await this.videoTexture.load();

      const geometry = GeometryBuilder.createPlaneWithAspectRatio(
        this.videoTexture.getVideoElement(),
        this.config.scale // 1.7 - més gran que Peixos
      );

      const material = MaterialFactory.createVideoMaterial(
        this.videoTexture.getTexture()
      );

      this.mesh = new THREE.Mesh(geometry, material);
      this.addAnimations();

      this.tracker.addAnchor(0, this.mesh);

      this.tracker.onTargetFound(0, () => {
        console.log('Penelles target found');
        this.videoTexture.play();
      });

      this.tracker.onTargetLost(0, () => {
        console.log('Penelles target lost');
        this.videoTexture.pause();
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing PenellesExperience:', error);
      throw error;
    }
  }

  addAnimations() {
    if (!this.mesh) return;

    let time = 0;
    const animate = () => {
      if (!this.isRunning) return;

      time += 0.01;
      this.mesh.rotation.z = Math.sin(time * 0.4) * 0.015;
      this.mesh.position.y = Math.sin(time * 0.8) * 0.015;

      requestAnimationFrame(animate);
    };

    animate();
  }

  async start() {
    super.start();
    if (this.tracker) await this.tracker.start();
  }

  stop() {
    super.stop();
    if (this.tracker) this.tracker.stop();
    if (this.videoTexture) this.videoTexture.pause();
  }

  destroy() {
    super.destroy();
    if (this.videoTexture) this.videoTexture.dispose();
    if (this.tracker) this.tracker.destroy();
    if (this.mesh) {
      if (this.mesh.geometry) this.mesh.geometry.dispose();
      if (this.mesh.material) this.mesh.material.dispose();
    }
  }
}
