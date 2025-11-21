/**
 * SceneManager - Gestió de l'escena Three.js
 * Configura camera, renderer i escena
 * Gestiona objectes 3D i loop d'animació
 */
export class SceneManager {
  constructor(threeConfig = {}) {
    this.config = {
      antialias: true,
      alpha: true,
      ...threeConfig
    };
    
    this.scene = new THREE.Scene();
    this.camera = this.createCamera(this.config);
    this.renderer = this.createRenderer(this.config);
    this.animationCallbacks = [];
    this.animationId = null;
  }

  /**
   * Crea la càmera Three.js
   */
  createCamera(config) {
    const camera = new THREE.PerspectiveCamera(
      config.fov || 75,
      window.innerWidth / window.innerHeight,
      config.near || 0.1,
      config.far || 1000
    );
    
    camera.position.z = config.cameraZ || 5;
    return camera;
  }

  /**
   * Crea el renderer Three.js
   */
  createRenderer(config) {
    const renderer = new THREE.WebGLRenderer({
      antialias: config.antialias,
      alpha: config.alpha
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    return renderer;
  }

  /**
   * Afegeix un objecte a l'escena
   */
  addObject(object) {
    this.scene.add(object);
  }

  /**
   * Elimina un objecte de l'escena
   */
  removeObject(object) {
    this.scene.remove(object);
  }

  /**
   * Registra un callback per al loop d'animació
   */
  onAnimate(callback) {
    this.animationCallbacks.push(callback);
  }

  /**
   * Loop d'animació principal
   */
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Executa tots els callbacks
    this.animationCallbacks.forEach(callback => callback());
    
    // Renderitza l'escena
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Inicia l'animació
   */
  startAnimation() {
    if (!this.animationId) {
      this.animate();
    }
  }

  /**
   * Atura l'animació
   */
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Ajusta la mida quan canvia la finestra
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Destrueix el scene manager
   */
  destroy() {
    this.stopAnimation();
    this.animationCallbacks = [];
    
    // Neteja l'escena
    while(this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    
    this.renderer.dispose();
  }
}
