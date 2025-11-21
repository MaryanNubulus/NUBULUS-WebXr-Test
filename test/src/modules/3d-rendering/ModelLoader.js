/**
 * ModelLoader - Càrrega de models 3D
 * Suport per GLTF/GLB amb sistema de cache
 */
export class ModelLoader {
  constructor() {
    this.gltfLoader = new THREE.GLTFLoader();
    this.fbxLoader = null; // lazy load
    this.cache = new Map();
    this.loadingProgress = new Map();
  }

  /**
   * Carrega un model GLTF/GLB
   */
  async loadGLTF(path) {
    // Verifica si està a la cache
    if (this.cache.has(path)) {
      console.log(`Loading ${path} from cache`);
      return this.cache.get(path).scene.clone();
    }

    // Verifica si s'està carregant
    if (this.loadingProgress.has(path)) {
      console.log(`Waiting for ${path} to finish loading...`);
      return this.loadingProgress.get(path);
    }

    // Crea una promesa per la càrrega
    const loadPromise = new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => {
          console.log(`GLTF model loaded: ${path}`);
          this.cache.set(path, gltf);
          this.loadingProgress.delete(path);
          resolve(gltf.scene.clone());
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Loading ${path}: ${percent.toFixed(2)}%`);
        },
        (error) => {
          console.error(`Error loading GLTF: ${path}`, error);
          this.loadingProgress.delete(path);
          reject(error);
        }
      );
    });

    this.loadingProgress.set(path, loadPromise);
    return loadPromise;
  }

  /**
   * Carrega un model FBX (lazy loading del loader)
   */
  async loadFBX(path) {
    // Lazy load FBXLoader
    if (!this.fbxLoader) {
      if (!THREE.FBXLoader) {
        throw new Error('FBXLoader not available. Include THREE.FBXLoader in your project.');
      }
      this.fbxLoader = new THREE.FBXLoader();
    }

    // Verifica cache
    if (this.cache.has(path)) {
      console.log(`Loading ${path} from cache`);
      return this.cache.get(path).clone();
    }

    return new Promise((resolve, reject) => {
      this.fbxLoader.load(
        path,
        (fbx) => {
          console.log(`FBX model loaded: ${path}`);
          this.cache.set(path, fbx);
          resolve(fbx.clone());
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Loading ${path}: ${percent.toFixed(2)}%`);
        },
        (error) => {
          console.error(`Error loading FBX: ${path}`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * Obté un model de la cache
   */
  getFromCache(path) {
    return this.cache.get(path) || null;
  }

  /**
   * Neteja la cache
   */
  clearCache() {
    this.cache.forEach((model, path) => {
      console.log(`Disposing cached model: ${path}`);
      this.disposeModel(model);
    });
    this.cache.clear();
  }

  /**
   * Neteja un model específic de la cache
   */
  removeFromCache(path) {
    if (this.cache.has(path)) {
      this.disposeModel(this.cache.get(path));
      this.cache.delete(path);
      console.log(`Removed ${path} from cache`);
    }
  }

  /**
   * Disposa d'un model i allibera memòria
   */
  disposeModel(model) {
    if (!model) return;

    model.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
