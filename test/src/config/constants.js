/**
 * Constants globals del projecte
 * Valors configurables i constants magic numbers
 */

// Versions
export const VERSION = '1.0.0';
export const API_VERSION = 'v1';

// Paths
export const PATHS = {
  ASSETS: './assets/',
  MODELS: './assets/models/',
  VIDEOS: './assets/videos/',
  IMAGES: './assets/images/',
  TARGETS: './assets/targets/',
  AUDIO: './assets/audio/',
};

// Configuració d'AR
export const AR_CONFIG = {
  // MindAR
  MINDAR_VERSION: '1.2.3',
  DEFAULT_FILTER_MIN_CF: 0.8,
  DEFAULT_FILTER_BETA: 0.8,
  
  // Threshold de tracking
  TRACKING_THRESHOLD: 0.5,
  
  // Distàncies
  MIN_DISTANCE: 0.1,
  MAX_DISTANCE: 1000,
  
  // Scales
  DEFAULT_SCALE: 1.0,
  MIN_SCALE: 0.1,
  MAX_SCALE: 10.0,
};

// Configuració de Geolocalització
export const GEO_CONFIG = {
  // Radi de la Terra en metres
  EARTH_RADIUS: 6371000,
  
  // Distàncies per defecte
  DEFAULT_VISIBILITY_DISTANCE: 20, // metres
  MAX_VISIBILITY_DISTANCE: 1000, // metres
  
  // Precisió
  MIN_ACCURACY: 5, // metres
  MAX_ACCURACY: 50, // metres
  
  // Update intervals
  LOCATION_UPDATE_INTERVAL: 1000, // ms
  ORIENTATION_UPDATE_INTERVAL: 100, // ms
};

// Configuració de UI
export const UI_CONFIG = {
  // Z-index layers
  Z_INDEX: {
    LOADING_SCREEN: 99999,
    CONTROL_PANEL: 10000,
    STATUS_DISPLAY: 10000,
    DEBUG_INFO: 9999,
  },
  
  // Colors
  COLORS: {
    PRIMARY: '#4CAF50',
    SECONDARY: '#2196F3',
    ERROR: '#F44336',
    WARNING: '#FF9800',
    SUCCESS: '#4CAF50',
    INFO: '#2196F3',
  },
  
  // Animacions
  ANIMATION_DURATION: 300, // ms
  FADE_DURATION: 200, // ms
};

// Configuració de Performance
export const PERFORMANCE_CONFIG = {
  // FPS
  TARGET_FPS: 60,
  MIN_FPS: 30,
  
  // Frame time
  MAX_FRAME_TIME: 33.33, // ms (30 FPS)
  
  // Memory
  MAX_TEXTURE_SIZE: 2048,
  MAX_VERTICES: 100000,
  
  // Cache
  MAX_CACHE_SIZE: 50, // MB
  CACHE_EXPIRY: 3600000, // 1 hora en ms
};

// Events
export const EVENTS = {
  // Experiència
  EXPERIENCE_INIT: 'experience:init',
  EXPERIENCE_START: 'experience:start',
  EXPERIENCE_STOP: 'experience:stop',
  EXPERIENCE_DESTROY: 'experience:destroy',
  
  // Tracking
  TARGET_FOUND: 'target:found',
  TARGET_LOST: 'target:lost',
  LOCATION_UPDATE: 'location:update',
  ORIENTATION_UPDATE: 'orientation:update',
  
  // Geofence
  GEOFENCE_ENTER: 'geofence:enter',
  GEOFENCE_EXIT: 'geofence:exit',
  
  // Assets
  ASSET_LOAD_START: 'asset:load:start',
  ASSET_LOAD_PROGRESS: 'asset:load:progress',
  ASSET_LOAD_COMPLETE: 'asset:load:complete',
  ASSET_LOAD_ERROR: 'asset:load:error',
  
  // Errors
  ERROR: 'error',
  WARNING: 'warning',
};

// Missatges d'error
export const ERROR_MESSAGES = {
  WEBGL_NOT_SUPPORTED: 'WebGL no està suportat en aquest navegador',
  CAMERA_PERMISSION_DENIED: 'Permís de càmera denegat',
  LOCATION_PERMISSION_DENIED: 'Permís de geolocalització denegat',
  ORIENTATION_PERMISSION_DENIED: 'Permís d\'orientació denegat',
  ASSET_LOAD_FAILED: 'Error carregant asset',
  EXPERIENCE_INIT_FAILED: 'Error inicialitzant experiència',
};

// Debug
export const DEBUG = {
  ENABLED: true,
  SHOW_FPS: true,
  SHOW_AXES: false,
  SHOW_GRID: false,
  LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
};

// Direcci cardinal
export const CARDINAL_DIRECTIONS = [
  'N',  // 0°
  'NE', // 45°
  'E',  // 90°
  'SE', // 135°
  'S',  // 180°
  'SW', // 225°
  'W',  // 270°
  'NW'  // 315°
];

// Unitats
export const UNITS = {
  DEGREES_TO_RADIANS: Math.PI / 180,
  RADIANS_TO_DEGREES: 180 / Math.PI,
  METERS_TO_FEET: 3.28084,
  FEET_TO_METERS: 0.3048,
};
