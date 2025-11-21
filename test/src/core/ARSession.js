/**
 * ARSession - Gestió de permisos i sessió AR
 * Controla permisos de càmera, ubicació i orientació
 * Detecta suport de funcionalitats del dispositiu
 */
export class ARSession {
  constructor() {
    this.isActive = false;
    this.permissions = {
      camera: false,
      location: false,
      orientation: false,
    };
  }

  /**
   * Sol·licita tots els permisos necessaris
   */
  async requestPermissions() {
    const results = {
      camera: await this.requestCameraPermission(),
      location: await this.requestLocationPermission(),
      orientation: await this.requestOrientationPermission(),
    };
    
    this.permissions = results;
    return results;
  }

  /**
   * Sol·licita permís de càmera
   */
  async requestCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Atura el stream immediatament, només volem verificar el permís
      stream.getTracks().forEach(track => track.stop());
      
      console.log('Camera permission granted');
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  }

  /**
   * Sol·licita permís de geolocalització
   */
  async requestLocationPermission() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error('Geolocation not supported');
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          console.log('Location permission granted');
          resolve(true);
        },
        (error) => {
          console.error('Location permission denied:', error);
          resolve(false);
        },
        { timeout: 5000 }
      );
    });
  }

  /**
   * Sol·licita permís d'orientació (necessari per iOS 13+)
   */
  async requestOrientationPermission() {
    // Si no és iOS o no necessita permís, retorna true
    if (typeof DeviceOrientationEvent === 'undefined') {
      console.error('DeviceOrientation not supported');
      return false;
    }

    // iOS 13+ necessita permís explícit
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        const granted = permission === 'granted';
        console.log('Orientation permission:', granted ? 'granted' : 'denied');
        return granted;
      } catch (error) {
        console.error('Orientation permission error:', error);
        return false;
      }
    } else {
      // Altres navegadors no necessiten permís explícit
      console.log('Orientation permission not required (auto-granted)');
      return true;
    }
  }

  /**
   * Verifica si tots els permisos estan concedits
   */
  hasAllPermissions() {
    return this.permissions.camera && 
           this.permissions.location && 
           this.permissions.orientation;
  }

  /**
   * Inicia la sessió AR
   */
  start() {
    if (!this.hasAllPermissions()) {
      console.warn('Cannot start AR session: missing permissions');
      return false;
    }
    
    this.isActive = true;
    console.log('AR session started');
    return true;
  }

  /**
   * Atura la sessió AR
   */
  stop() {
    this.isActive = false;
    console.log('AR session stopped');
  }

  /**
   * Detecta capacitats del dispositiu
   */
  static detectCapabilities() {
    return {
      webgl: !!window.WebGLRenderingContext,
      geolocation: !!navigator.geolocation,
      deviceOrientation: typeof DeviceOrientationEvent !== 'undefined',
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      webxr: !!(navigator.xr),
    };
  }
}
