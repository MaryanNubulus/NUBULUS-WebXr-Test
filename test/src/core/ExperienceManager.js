/**
 * ExperienceManager - Classe base abstracta per a totes les experiències
 * Gestiona el cicle de vida: init, start, stop, destroy
 * Implementa sistema d'events per comunicació entre mòduls
 */
export class ExperienceManager {
  constructor(config = {}) {
    this.type = config.type; // 'image-tracking', 'geolocation', 'mixed'
    this.name = config.name || 'Unnamed Experience';
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.isInitialized = false;
    this.isRunning = false;
    
    // Sistema d'events
    this.eventListeners = new Map();
  }

  /**
   * Inicialitza l'experiència
   * Aquest mètode s'ha d'implementar a les classes filles
   */
  async init() {
    console.log(`Initializing ${this.name} experience...`);
    this.isInitialized = true;
  }

  /**
   * Inicia l'experiència
   */
  start() {
    if (!this.isInitialized) {
      console.warn('Experience not initialized. Call init() first.');
      return;
    }
    console.log(`Starting ${this.name} experience...`);
    this.isRunning = true;
  }

  /**
   * Atura l'experiència
   */
  stop() {
    console.log(`Stopping ${this.name} experience...`);
    this.isRunning = false;
  }

  /**
   * Destrueix l'experiència i allibera recursos
   */
  destroy() {
    console.log(`Destroying ${this.name} experience...`);
    this.stop();
    this.eventListeners.clear();
    this.isInitialized = false;
  }

  /**
   * Registra un listener per un event
   */
  on(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName).push(callback);
  }

  /**
   * Elimina un listener d'un event
   */
  off(eventName, callback) {
    if (!this.eventListeners.has(eventName)) return;
    
    const listeners = this.eventListeners.get(eventName);
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Emet un event
   */
  emit(eventName, data) {
    if (!this.eventListeners.has(eventName)) return;
    
    const listeners = this.eventListeners.get(eventName);
    listeners.forEach(callback => callback(data));
  }
}
