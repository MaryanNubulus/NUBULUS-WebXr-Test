/**
 * Configuració de Three.js
 * Paràmetres de renderer, càmera, etc.
 */
export const threeConfig = {
  renderer: {
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    precision: 'highp',
    stencil: false,
    depth: true,
    logarithmicDepthBuffer: false,
  },

  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    position: {
      x: 0,
      y: 0,
      z: 5,
    },
  },

  scene: {
    background: null, // transparent per AR
    fog: null,
  },

  lights: {
    ambient: {
      enabled: true,
      color: 0xffffff,
      intensity: 0.8,
    },
    directional: {
      enabled: true,
      color: 0xffffff,
      intensity: 0.5,
      position: {
        x: 5,
        y: 10,
        z: 7.5,
      },
    },
    point: {
      enabled: false,
      color: 0xffffff,
      intensity: 1,
      distance: 100,
      decay: 2,
    },
  },

  shadows: {
    enabled: false,
    type: THREE.PCFSoftShadowMap, // THREE.BasicShadowMap, THREE.PCFShadowMap, THREE.PCFSoftShadowMap, THREE.VSMShadowMap
    mapSize: {
      width: 1024,
      height: 1024,
    },
  },

  postProcessing: {
    enabled: false,
    effects: [],
  },

  performance: {
    maxDeltaTime: 0.1, // max frame time (seconds)
    targetFPS: 60,
  },
};

/**
 * Configuració específica per experiències d'image tracking
 */
export const imageTrackingConfig = {
  filterMinCF: 0.8,
  filterBeta: 0.8,
  warmupTolerance: 5,
  missTolerance: 5,
  uiLoading: 'yes',
  uiScanning: 'yes',
  uiError: 'yes',
};

/**
 * Configuració específica per experiències de geolocalització
 */
export const geolocationConfig = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
  updateInterval: 1000, // ms
};

/**
 * Obté la configuració de Three.js
 */
export function getThreeConfig() {
  return { ...threeConfig };
}

/**
 * Obté la configuració d'image tracking
 */
export function getImageTrackingConfig() {
  return { ...imageTrackingConfig };
}

/**
 * Obté la configuració de geolocalització
 */
export function getGeolocationConfig() {
  return { ...geolocationConfig };
}
