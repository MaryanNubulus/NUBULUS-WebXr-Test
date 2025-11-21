import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * Gestiona l'escena 3D de Three.js per AR
 */
export class ARScene {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
  }

  /**
   * Inicialitza l'escena, càmera i renderer
   */
  init() {
    // Crear escena
    this.scene = new THREE.Scene();

    // Crear càmera
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 0);

    // Crear renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true // Fons transparent per veure el vídeo
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0); // Transparent
    document.body.appendChild(this.renderer.domElement);

    // Afegir il·luminació
    this.setupLights();

    // Gestionar canvis de mida de finestra
    window.addEventListener("resize", () => this.onWindowResize());

    console.log("✅ Escena AR inicialitzada");
  }

  /**
   * Configura la il·luminació de l'escena
   */
  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    this.scene.add(hemisphereLight);
  }

  /**
   * Carrega un model GLB
   */
  loadModel(modelPath, onLoad, onProgress, onError) {
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        this.model = gltf.scene;

        // Posicionar l'objecte DAVANT de la càmera per defecte
        this.model.position.set(0, 0, -10);
        this.model.scale.set(2, 2, 2);

        // Assegurar que el model té materials visibles
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;

            if (!child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide
              });
            }
          }
        });

        this.scene.add(this.model);
        console.log("✅ Model GLB carregat i posicionat");

        if (onLoad) onLoad(this.model);
      },
      (progress) => {
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("❌ Error carregant model GLB:", error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * Actualitza la posició del model segons la geolocalització
   */
  updateModelPosition(distance, visible) {
    if (!this.model) return;

    this.model.position.x = 0;
    this.model.position.y = 0;
    this.model.position.z = -distance;
    this.model.visible = visible;
  }

  /**
   * Renderitza l'escena
   */
  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Gestiona els canvis de mida de finestra
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Obté la càmera
   */
  getCamera() {
    return this.camera;
  }

  /**
   * Obté el model
   */
  getModel() {
    return this.model;
  }
}
