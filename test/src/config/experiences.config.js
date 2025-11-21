/**
 * Configuració de totes les experiències
 * Paths a assets i paràmetres per defecte
 */
export const experiencesConfig = {
  belloc: {
    name: 'Experiència Belloc',
    description: 'AR amb custom shape geometry i reproducció de vídeo',
    type: 'image-tracking',
    enabled: true,
    assets: {
      target: './assets/targets/belloc.mind',
      video: './assets/videos/belloc.mp4',
    },
    geometry: {
      type: 'custom-shape',
      points: [
        { x: 0.51, y: 0.11 },
        { x: 0.98, y: 0.42 },
        { x: 0.99, y: 0.91 },
        { x: 0.01, y: 0.9 },
        { x: 0.03, y: 0.41 },
      ],
    },
    scale: 0.45,
    audio: {
      enabled: true,
      muted: false,
    },
  },

  peixos: {
    name: 'Experiència Peixos',
    description: 'AR amb plane geometry i vídeo',
    type: 'image-tracking',
    enabled: true,
    assets: {
      target: './assets/targets/peixos.mind',
      video: './assets/videos/peixos.mp4',
    },
    geometry: {
      type: 'plane',
    },
    scale: 0.6,
    audio: {
      enabled: true,
      muted: true,
    },
  },

  penelles: {
    name: 'Experiència Penelles',
    description: 'AR amb plane geometry i vídeo (gran)',
    type: 'image-tracking',
    enabled: true,
    assets: {
      target: './assets/targets/penelles.mind',
      video: './assets/videos/penelles.mp4',
    },
    geometry: {
      type: 'plane',
    },
    scale: 1.7,
    audio: {
      enabled: true,
      muted: true,
    },
  },

  geolocation: {
    name: 'Experiència Geolocalització',
    description: 'Experiència basada en GPS i orientació',
    type: 'geolocation',
    enabled: true,
    targetLocation: {
      lat: 41.231,
      lon: 1.123,
    },
    targetOrientation: 120, // graus
    geofence: {
      type: 'polygon',
      coordinates: [
        { lat: 41.23, lon: 1.12 },
        { lat: 41.24, lon: 1.12 },
        { lat: 41.24, lon: 1.13 },
        { lat: 41.23, lon: 1.13 },
      ],
    },
    tracking: {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  },

  object3dgeo: {
    name: 'Experiència 3D Geolocalització',
    description: 'Models 3D posicionats per GPS amb indicador direccional',
    type: 'mixed',
    enabled: true,
    targetLocation: {
      lat: 41.631736995249575,
      lon: 0.7782826945720215,
    },
    assets: {
      model: './assets/models/test.glb',
    },
    visibilityDistance: 20, // metres
    modelScale: 5,
    tracking: {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
    indicator: {
      enabled: true,
      color: 0xff0000,
      size: 0.5,
    },
  },
};

/**
 * Obté la configuració d'una experiència
 */
export function getExperienceConfig(id) {
  return experiencesConfig[id] || null;
}

/**
 * Llista totes les experiències disponibles
 */
export function listExperiences() {
  return Object.keys(experiencesConfig).map(id => ({
    id,
    name: experiencesConfig[id].name,
    description: experiencesConfig[id].description,
    type: experiencesConfig[id].type,
    enabled: experiencesConfig[id].enabled,
  }));
}

/**
 * Llista experiències per tipus
 */
export function listExperiencesByType(type) {
  return Object.keys(experiencesConfig)
    .filter(id => experiencesConfig[id].type === type)
    .map(id => ({
      id,
      ...experiencesConfig[id],
    }));
}
