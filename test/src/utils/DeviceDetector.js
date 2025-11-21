/**
 * DeviceDetector - Detecció de tipus de dispositiu
 * Capacitats del navegador i features
 */
export class DeviceDetector {
  constructor() {
    this.info = this.detectAll();
  }

  /**
   * Detecta tota la informació del dispositiu
   */
  detectAll() {
    return {
      os: this.detectOS(),
      browser: this.detectBrowser(),
      device: this.detectDeviceType(),
      screen: this.getScreenInfo(),
      capabilities: this.detectCapabilities(),
      sensors: this.detectSensors()
    };
  }

  /**
   * Detecta el sistema operatiu
   */
  detectOS() {
    const userAgent = navigator.userAgent;
    
    if (/Windows/i.test(userAgent)) return 'Windows';
    if (/Mac OS X/i.test(userAgent)) return 'macOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    if (/Android/i.test(userAgent)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
    
    return 'Unknown';
  }

  /**
   * Detecta el navegador
   */
  detectBrowser() {
    const userAgent = navigator.userAgent;
    
    if (/Firefox/i.test(userAgent)) return 'Firefox';
    if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) return 'Chrome';
    if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return 'Safari';
    if (/Edge/i.test(userAgent)) return 'Edge';
    if (/Opera|OPR/i.test(userAgent)) return 'Opera';
    
    return 'Unknown';
  }

  /**
   * Detecta el tipus de dispositiu
   */
  detectDeviceType() {
    const userAgent = navigator.userAgent;
    
    if (/Mobile|Android|iPhone/i.test(userAgent)) return 'mobile';
    if (/Tablet|iPad/i.test(userAgent)) return 'tablet';
    
    return 'desktop';
  }

  /**
   * Obté informació de la pantalla
   */
  getScreenInfo() {
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: this.getOrientation(),
      colorDepth: window.screen.colorDepth
    };
  }

  /**
   * Obté l'orientació de la pantalla
   */
  getOrientation() {
    if (window.screen.orientation) {
      return window.screen.orientation.type;
    }
    
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }

  /**
   * Detecta capacitats del navegador
   */
  detectCapabilities() {
    return {
      webgl: this.supportsWebGL(),
      webgl2: this.supportsWebGL2(),
      webxr: 'xr' in navigator,
      serviceWorker: 'serviceWorker' in navigator,
      webWorker: typeof Worker !== 'undefined',
      webAssembly: typeof WebAssembly !== 'undefined',
      indexedDB: !!window.indexedDB,
      localStorage: this.supportsLocalStorage(),
      sessionStorage: this.supportsSessionStorage(),
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      webAudio: !!(window.AudioContext || window.webkitAudioContext),
      fullscreen: !!(document.fullscreenEnabled || document.webkitFullscreenEnabled),
      pointerLock: !!(document.pointerLockElement !== undefined || 
                      document.webkitPointerLockElement !== undefined),
      vibration: 'vibrate' in navigator,
      bluetooth: 'bluetooth' in navigator,
      usb: 'usb' in navigator
    };
  }

  /**
   * Detecta sensors disponibles
   */
  detectSensors() {
    return {
      geolocation: 'geolocation' in navigator,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      deviceMotion: 'DeviceMotionEvent' in window,
      ambientLight: 'AmbientLightSensor' in window,
      accelerometer: 'Accelerometer' in window,
      gyroscope: 'Gyroscope' in window,
      magnetometer: 'Magnetometer' in window
    };
  }

  /**
   * Verifica suport de WebGL
   */
  supportsWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Verifica suport de WebGL 2
   */
  supportsWebGL2() {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    } catch (e) {
      return false;
    }
  }

  /**
   * Verifica suport de localStorage
   */
  supportsLocalStorage() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Verifica suport de sessionStorage
   */
  supportsSessionStorage() {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Obté informació de GPU (si disponible via WebGL)
   */
  getGPUInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return null;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      
      if (!debugInfo) return null;

      return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Obté informació completa del dispositiu
   */
  getInfo() {
    return this.info;
  }

  /**
   * Genera un report complet
   */
  generateReport() {
    return {
      ...this.info,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      onLine: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      gpu: this.getGPUInfo(),
      timestamp: new Date().toISOString()
    };
  }
}
