/**
 * TargetManager - Gestió de targets d'imatge
 * Càrrega i gestió de fitxers .mind
 * Events de found/lost
 */
export class TargetManager {
  constructor() {
    this.targets = new Map();
    this.activeTargets = new Set();
    this.callbacks = {
      found: new Map(),
      lost: new Map()
    };
  }

  /**
   * Carrega un target
   */
  async loadTarget(id, path) {
    if (this.targets.has(id)) {
      console.warn(`Target ${id} already loaded`);
      return this.targets.get(id);
    }

    const target = {
      id,
      path,
      isActive: false,
      lastSeen: null
    };

    this.targets.set(id, target);
    console.log(`Target ${id} loaded from ${path}`);
    
    return target;
  }

  /**
   * Obté un target per id
   */
  getTarget(id) {
    return this.targets.get(id);
  }

  /**
   * Marca un target com a trobat
   */
  setTargetFound(id) {
    const target = this.targets.get(id);
    if (!target) return;

    if (!target.isActive) {
      target.isActive = true;
      target.lastSeen = Date.now();
      this.activeTargets.add(id);

      // Notifica callbacks
      this.triggerCallbacks('found', id, target);
      
      console.log(`Target ${id} found`);
    }
  }

  /**
   * Marca un target com a perdut
   */
  setTargetLost(id) {
    const target = this.targets.get(id);
    if (!target) return;

    if (target.isActive) {
      target.isActive = false;
      this.activeTargets.delete(id);

      // Notifica callbacks
      this.triggerCallbacks('lost', id, target);
      
      console.log(`Target ${id} lost`);
    }
  }

  /**
   * Registra un callback per quan es troba un target
   */
  onTargetFound(id, callback) {
    if (!this.callbacks.found.has(id)) {
      this.callbacks.found.set(id, []);
    }
    this.callbacks.found.get(id).push(callback);
  }

  /**
   * Registra un callback per quan es perd un target
   */
  onTargetLost(id, callback) {
    if (!this.callbacks.lost.has(id)) {
      this.callbacks.lost.set(id, []);
    }
    this.callbacks.lost.get(id).push(callback);
  }

  /**
   * Executa callbacks
   */
  triggerCallbacks(type, id, target) {
    const callbacks = this.callbacks[type].get(id);
    if (!callbacks) return;

    callbacks.forEach(callback => callback(target));
  }

  /**
   * Obté tots els targets actius
   */
  getActiveTargets() {
    return Array.from(this.activeTargets).map(id => this.targets.get(id));
  }

  /**
   * Neteja tots els targets
   */
  clear() {
    this.targets.clear();
    this.activeTargets.clear();
    this.callbacks.found.clear();
    this.callbacks.lost.clear();
  }
}
