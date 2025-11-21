import * as THREE from "three";

/**
 * Gestiona l'orientació del dispositiu per a experiències AR
 */
export class DeviceOrientationManager {
  constructor(camera) {
    this.camera = camera;
    this.deviceOrientation = { alpha: 0, beta: 0, gamma: 0 };
    this.screenOrientation = 0;
    this.isActive = false;
  }

  /**
   * Inicialitza els listeners d'orientació del dispositiu
   */
  async init() {
    // Demanar permisos per a DeviceOrientation (necessari per iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          console.log("✅ Permís d'orientació concedit");
          this.setupListeners();
          return true;
        } else {
          console.warn("⚠️ Permís d'orientació denegat");
          return false;
        }
      } catch (err) {
        console.error("Error demanant permís d'orientació:", err);
        return false;
      }
    } else {
      // Android o navegadors que no necessiten permís
      this.setupListeners();
      return true;
    }
  }

  /**
   * Configura els listeners d'events
   */
  setupListeners() {
    // Escoltar events d'orientació del dispositiu
    window.addEventListener('deviceorientation', (event) => {
      this.deviceOrientation.alpha = event.alpha || 0; // Rotació al voltant de l'eix Z (0-360)
      this.deviceOrientation.beta = event.beta || 0;   // Rotació al voltant de l'eix X (-180 a 180)
      this.deviceOrientation.gamma = event.gamma || 0; // Rotació al voltant de l'eix Y (-90 a 90)
      this.isActive = true;
    });

    // Escoltar canvis d'orientació de la pantalla
    window.addEventListener('orientationchange', () => {
      this.screenOrientation = window.orientation || 0;
    });

    console.log("✅ Listeners d'orientació activats");
  }

  /**
   * Actualitza la rotació de la càmera segons l'orientació del dispositiu
   */
  update() {
    if (!this.isActive || !this.camera) return;

    const alpha = THREE.MathUtils.degToRad(this.deviceOrientation.alpha);
    const beta = THREE.MathUtils.degToRad(this.deviceOrientation.beta);
    const gamma = THREE.MathUtils.degToRad(this.deviceOrientation.gamma);
    const orient = THREE.MathUtils.degToRad(this.screenOrientation);

    // Crear quaternions per a cada eix de rotació
    const zee = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 al voltant de l'eix X

    euler.set(beta, alpha, -gamma, 'YXZ'); // Ordre d'Euler: YXZ
    this.camera.quaternion.setFromEuler(euler);
    this.camera.quaternion.multiply(q1);
    this.camera.quaternion.multiply(q0.setFromAxisAngle(zee, -orient));
  }
}
