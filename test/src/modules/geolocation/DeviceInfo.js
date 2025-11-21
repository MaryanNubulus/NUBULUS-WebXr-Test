/**
 * DeviceInfo - Encapsula la informació del dispositiu
 * Gestió de ubicació, orientació i estat de la pantalla
 */
export class DeviceInfo {
  constructor() {
    this.location = { 
      lat: null, 
      lon: null, 
      accuracy: null,
      timestamp: null
    };
    
    this.orientation = { 
      alpha: 0,   // compass (0-360)
      beta: 0,    // tilt front-back (-180 to 180)
      gamma: 0,   // tilt left-right (-90 to 90)
      cardinal: 'N' 
    };
    
    this.screen = { 
      mode: 'portrait',
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: 0
    };

    this.isTracking = false;
  }

  /**
   * Inicialitza el tracking
   */
  async init() {
    this.updateScreenInfo();
    
    // Listener per canvis d'orientació de pantalla
    window.addEventListener('resize', () => this.updateScreenInfo());
    
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', () => this.updateScreenInfo());
    }
    
    console.log('DeviceInfo initialized');
  }

  /**
   * Actualitza la informació de la pantalla
   */
  updateScreenInfo() {
    this.screen.width = window.innerWidth;
    this.screen.height = window.innerHeight;
    
    if (window.screen && window.screen.orientation) {
      this.screen.orientation = window.screen.orientation.angle;
      this.screen.mode = window.screen.orientation.type.includes('portrait') 
        ? 'portrait' 
        : 'landscape';
    } else {
      // Fallback
      this.screen.mode = this.screen.height > this.screen.width 
        ? 'portrait' 
        : 'landscape';
    }
  }

  /**
   * Inicia el tracking
   */
  startTracking() {
    this.isTracking = true;
  }

  /**
   * Atura el tracking
   */
  stopTracking() {
    this.isTracking = false;
  }

  /**
   * Actualitza la ubicació
   */
  updateLocation(lat, lon, accuracy) {
    this.location.lat = lat;
    this.location.lon = lon;
    this.location.accuracy = accuracy;
    this.location.timestamp = Date.now();
  }

  /**
   * Actualitza l'orientació
   */
  updateOrientation(alpha, beta, gamma, cardinal) {
    this.orientation.alpha = alpha;
    this.orientation.beta = beta;
    this.orientation.gamma = gamma;
    this.orientation.cardinal = cardinal;
  }

  /**
   * Retorna un snapshot de l'estat actual
   */
  getSnapshot() {
    return {
      location: { ...this.location },
      orientation: { ...this.orientation },
      screen: { ...this.screen },
      timestamp: Date.now()
    };
  }
}
