/**
 * LocationTracker - Gestió de geolocalització
 * Utilitza watchPosition per tracking continu
 * Sistema de callbacks per actualitzacions
 */
export class LocationTracker {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
    this.callbacks = [];
    this.options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
  }

  /**
   * Inicia el tracking de ubicació
   */
  start(options = {}) {
    if (this.watchId !== null) {
      console.warn('Location tracking already started');
      return;
    }

    this.options = { ...this.options, ...options };

    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handlePosition(position),
      (error) => this.handleError(error),
      this.options
    );

    console.log('Location tracking started');
  }

  /**
   * Atura el tracking
   */
  stop() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log('Location tracking stopped');
    }
  }

  /**
   * Gestiona l'actualització de posició
   */
  handlePosition(position) {
    this.currentPosition = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };

    // Notifica a tots els callbacks
    this.callbacks.forEach(callback => callback(this.currentPosition));
  }

  /**
   * Gestiona errors de geolocalització
   */
  handleError(error) {
    console.error('Geolocation error:', error.message);
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied geolocation permission');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Position unavailable');
        break;
      case error.TIMEOUT:
        console.error('Geolocation timeout');
        break;
    }
  }

  /**
   * Registra un callback per actualitzacions
   */
  onUpdate(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Calcula la distància a un punt (Haversine)
   */
  getDistance(lat, lon) {
    if (!this.currentPosition) {
      return null;
    }

    const R = 6371000; // Radi de la Terra en metres
    const lat1 = this.currentPosition.lat * Math.PI / 180;
    const lat2 = lat * Math.PI / 180;
    const dLat = (lat - this.currentPosition.lat) * Math.PI / 180;
    const dLon = (lon - this.currentPosition.lon) * Math.PI / 180;

    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Retorna distància en metres
  }

  /**
   * Obté la posició actual de manera asíncrona (una sola vegada)
   */
  async getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => reject(error),
        { ...this.options, ...options }
      );
    });
  }
}
