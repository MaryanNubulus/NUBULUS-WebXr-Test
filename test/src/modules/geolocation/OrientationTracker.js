/**
 * OrientationTracker - Gestió de Device Orientation API
 * Tracking de compass i tilt del dispositiu
 * Conversió a direccions cardinals
 */
export class OrientationTracker {
  constructor() {
    this.alpha = 0;   // compass (0-360)
    this.beta = 0;    // tilt front-back (-180 to 180)
    this.gamma = 0;   // tilt left-right (-90 to 90)
    this.callbacks = [];
    this.isTracking = false;
    this.boundHandler = null;
  }

  /**
   * Sol·licita permís (necessari per iOS 13+)
   */
  async requestPermission() {
    if (typeof DeviceOrientationEvent === 'undefined') {
      throw new Error('DeviceOrientation not supported');
    }

    // iOS 13+ necessita permís explícit
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') {
          throw new Error('DeviceOrientation permission denied');
        }
        console.log('DeviceOrientation permission granted');
      } catch (error) {
        console.error('Error requesting orientation permission:', error);
        throw error;
      }
    }
  }

  /**
   * Inicia el tracking d'orientació
   */
  start() {
    if (this.isTracking) {
      console.warn('Orientation tracking already started');
      return;
    }

    this.boundHandler = (event) => this.handleOrientation(event);
    window.addEventListener('deviceorientation', this.boundHandler);
    
    this.isTracking = true;
    console.log('Orientation tracking started');
  }

  /**
   * Atura el tracking
   */
  stop() {
    if (!this.isTracking) return;

    if (this.boundHandler) {
      window.removeEventListener('deviceorientation', this.boundHandler);
      this.boundHandler = null;
    }
    
    this.isTracking = false;
    console.log('Orientation tracking stopped');
  }

  /**
   * Gestiona events d'orientació
   */
  handleOrientation(event) {
    // Alpha: compass (0-360), null si no disponible
    this.alpha = event.alpha !== null ? event.alpha : 0;
    
    // Beta: tilt front-back (-180 to 180)
    this.beta = event.beta !== null ? event.beta : 0;
    
    // Gamma: tilt left-right (-90 to 90)
    this.gamma = event.gamma !== null ? event.gamma : 0;

    const data = {
      alpha: this.alpha,
      beta: this.beta,
      gamma: this.gamma,
      cardinal: this.getCardinalDirection()
    };

    // Notifica callbacks
    this.callbacks.forEach(callback => callback(data));
  }

  /**
   * Registra un callback per actualitzacions
   */
  onUpdate(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Converteix alpha a direcció cardinal
   */
  getCardinalDirection() {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(this.alpha / 45) % 8;
    return directions[index];
  }

  /**
   * Obté la direcció cardinal detallada (amb graus)
   */
  getDetailedDirection() {
    return {
      degrees: Math.round(this.alpha),
      cardinal: this.getCardinalDirection(),
      radians: this.alpha * Math.PI / 180
    };
  }

  /**
   * Normalitza el tilt segons l'orientació de la pantalla
   */
  getNormalizedTilt() {
    const screenOrientation = window.screen?.orientation?.angle || 0;
    
    let normalizedBeta = this.beta;
    let normalizedGamma = this.gamma;

    // Ajusta segons l'orientació de la pantalla
    switch (screenOrientation) {
      case 90: // Landscape right
        normalizedBeta = -this.gamma;
        normalizedGamma = this.beta;
        break;
      case -90:
      case 270: // Landscape left
        normalizedBeta = this.gamma;
        normalizedGamma = -this.beta;
        break;
      case 180: // Portrait upside down
        normalizedBeta = -this.beta;
        normalizedGamma = -this.gamma;
        break;
    }

    return {
      beta: normalizedBeta,
      gamma: normalizedGamma
    };
  }
}
