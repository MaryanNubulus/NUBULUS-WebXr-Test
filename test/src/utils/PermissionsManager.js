/**
 * PermissionsManager - Gestió centralitzada de permisos
 * Detecció de navegadors i compatibilitat
 */
export class PermissionsManager {
  constructor() {
    this.permissions = {
      camera: null,
      microphone: null,
      geolocation: null,
      deviceOrientation: null,
      notifications: null
    };
  }

  /**
   * Sol·licita permís de càmera
   */
  async requestCamera(constraints = { video: true, audio: false }) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Atura el stream immediatament
      stream.getTracks().forEach(track => track.stop());
      
      this.permissions.camera = 'granted';
      return { granted: true, stream: null };
    } catch (error) {
      this.permissions.camera = 'denied';
      console.error('Camera permission denied:', error);
      return { granted: false, error };
    }
  }

  /**
   * Sol·licita permís de micròfon
   */
  async requestMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });
      
      stream.getTracks().forEach(track => track.stop());
      
      this.permissions.microphone = 'granted';
      return { granted: true };
    } catch (error) {
      this.permissions.microphone = 'denied';
      console.error('Microphone permission denied:', error);
      return { granted: false, error };
    }
  }

  /**
   * Sol·licita permís de geolocalització
   */
  async requestGeolocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        this.permissions.geolocation = 'not_supported';
        resolve({ granted: false, error: 'Geolocation not supported' });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          this.permissions.geolocation = 'granted';
          resolve({ granted: true });
        },
        (error) => {
          this.permissions.geolocation = 'denied';
          resolve({ granted: false, error });
        },
        { timeout: 5000 }
      );
    });
  }

  /**
   * Sol·licita permís d'orientació del dispositiu (iOS 13+)
   */
  async requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent === 'undefined') {
      this.permissions.deviceOrientation = 'not_supported';
      return { granted: false, error: 'DeviceOrientation not supported' };
    }

    // iOS 13+ necessita permís explícit
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        this.permissions.deviceOrientation = permission;
        return { granted: permission === 'granted' };
      } catch (error) {
        this.permissions.deviceOrientation = 'denied';
        return { granted: false, error };
      }
    } else {
      // Altres navegadors no necessiten permís
      this.permissions.deviceOrientation = 'granted';
      return { granted: true };
    }
  }

  /**
   * Sol·licita permís de notificacions
   */
  async requestNotifications() {
    if (!('Notification' in window)) {
      this.permissions.notifications = 'not_supported';
      return { granted: false, error: 'Notifications not supported' };
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissions.notifications = permission;
      return { granted: permission === 'granted' };
    } catch (error) {
      this.permissions.notifications = 'denied';
      return { granted: false, error };
    }
  }

  /**
   * Verifica l'estat d'un permís via Permissions API (si disponible)
   */
  async checkPermission(name) {
    if (!navigator.permissions) {
      return { state: 'unknown', error: 'Permissions API not supported' };
    }

    try {
      const result = await navigator.permissions.query({ name });
      return { state: result.state };
    } catch (error) {
      return { state: 'unknown', error };
    }
  }

  /**
   * Obté l'estat de tots els permisos
   */
  getPermissionsState() {
    return { ...this.permissions };
  }

  /**
   * Verifica si tots els permisos necessaris estan concedits
   */
  hasAllPermissions(requiredPermissions = []) {
    return requiredPermissions.every(permission => {
      return this.permissions[permission] === 'granted';
    });
  }

  /**
   * Detecta si és iOS
   */
  static isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  /**
   * Detecta si és Safari
   */
  static isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  /**
   * Detecta si és mòbil
   */
  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  /**
   * Detecta suport de WebXR
   */
  static supportsWebXR() {
    return 'xr' in navigator;
  }
}
