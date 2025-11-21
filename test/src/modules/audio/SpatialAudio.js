/**
 * SpatialAudio - Àudio 3D posicional
 * Listener tracking per àudio espacial
 */
export class SpatialAudio {
  constructor(audioManager) {
    this.manager = audioManager;
    this.listener = null;
    this.sources = new Map();
  }

  /**
   * Crea un listener 3D (normalment associat a la càmera)
   */
  createListener(camera) {
    if (!this.manager.context) {
      throw new Error('AudioManager not initialized');
    }

    this.listener = this.manager.context.listener;

    // Configura la posició i orientació del listener
    if (camera) {
      this.updateListenerFromCamera(camera);
    }

    console.log('Spatial audio listener created');
    return this.listener;
  }

  /**
   * Actualitza el listener des d'una càmera Three.js
   */
  updateListenerFromCamera(camera) {
    if (!this.listener) return;

    const position = camera.position;
    const quaternion = camera.quaternion;

    // Web Audio API usa setPosition per versions antigues
    if (this.listener.positionX) {
      // Mètode modern
      this.listener.positionX.value = position.x;
      this.listener.positionY.value = position.y;
      this.listener.positionZ.value = position.z;
    } else {
      // Mètode deprecated però encara compatible
      this.listener.setPosition(position.x, position.y, position.z);
    }

    // Calcula l'orientació
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(quaternion);

    const up = new THREE.Vector3(0, 1, 0);
    up.applyQuaternion(quaternion);

    if (this.listener.forwardX) {
      // Mètode modern
      this.listener.forwardX.value = forward.x;
      this.listener.forwardY.value = forward.y;
      this.listener.forwardZ.value = forward.z;
      this.listener.upX.value = up.x;
      this.listener.upY.value = up.y;
      this.listener.upZ.value = up.z;
    } else {
      // Mètode deprecated
      this.listener.setOrientation(
        forward.x, forward.y, forward.z,
        up.x, up.y, up.z
      );
    }
  }

  /**
   * Crea un so 3D posicional
   */
  async create3DSound(id, path, position) {
    // Carrega el so
    await this.manager.loadSound(id, path);

    const sound = this.manager.sounds.get(id);
    if (!sound) return null;

    // Crea panner per àudio espacial
    const panner = this.manager.context.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;

    // Estableix la posició
    if (position) {
      this.setPosition(id, position.x, position.y, position.z, panner);
    }

    this.sources.set(id, {
      panner,
      position: position || { x: 0, y: 0, z: 0 }
    });

    console.log(`3D sound created: ${id}`);
    return { sound, panner };
  }

  /**
   * Estableix la posició d'un so 3D
   */
  setPosition(id, x, y, z, panner = null) {
    const source = this.sources.get(id);
    if (!source) return;

    const pannerNode = panner || source.panner;

    if (pannerNode.positionX) {
      // Mètode modern
      pannerNode.positionX.value = x;
      pannerNode.positionY.value = y;
      pannerNode.positionZ.value = z;
    } else {
      // Mètode deprecated
      pannerNode.setPosition(x, y, z);
    }

    source.position = { x, y, z };
  }

  /**
   * Actualitza la posició d'un so des d'un objecte Three.js
   */
  updateFromObject3D(id, object3D) {
    const position = object3D.position;
    this.setPosition(id, position.x, position.y, position.z);
  }

  /**
   * Configura paràmetres del panner
   */
  configurePanner(id, config = {}) {
    const source = this.sources.get(id);
    if (!source) return;

    const panner = source.panner;

    if (config.refDistance !== undefined) panner.refDistance = config.refDistance;
    if (config.maxDistance !== undefined) panner.maxDistance = config.maxDistance;
    if (config.rolloffFactor !== undefined) panner.rolloffFactor = config.rolloffFactor;
    if (config.coneInnerAngle !== undefined) panner.coneInnerAngle = config.coneInnerAngle;
    if (config.coneOuterAngle !== undefined) panner.coneOuterAngle = config.coneOuterAngle;
    if (config.coneOuterGain !== undefined) panner.coneOuterGain = config.coneOuterGain;
  }

  /**
   * Neteja
   */
  dispose() {
    this.sources.forEach((source, id) => {
      if (source.panner) {
        source.panner.disconnect();
      }
    });
    this.sources.clear();
    this.listener = null;
  }
}
