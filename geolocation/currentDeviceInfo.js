export class CurrentDeviceInfo {
  constructor() {
    this.location = { lat: null, lon: null };
    this.orientation = { degrees: 0, cardinal: "" };
    this.screen = { mode: this.getScreenMode() };
    this.tilt = { beta: 0, gamma: 0 };

    this.init();
  }

  async init() {
    await this.requestPermissions();
    this.startLocationTracking();
    this.startOrientationTracking();
    this.startScreenTracking();
  }

  /* ---------- PERMISOS ---------- */
  async requestPermissions() {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        await DeviceOrientationEvent.requestPermission();
      } catch (e) {}
    }

    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        await DeviceMotionEvent.requestPermission();
      } catch (e) {}
    }
  }

  /* ---------- GEOLOCALITZACIÓ ---------- */
  startLocationTracking() {
    navigator.geolocation.watchPosition((pos) => {
      this.updateLocation(pos.coords.latitude, pos.coords.longitude);
    });
  }

  updateLocation(lat, lon) {
    this.location.lat = lat;
    this.location.lon = lon;
  }

  /* ---------- ORIENTACIÓ I TILT ---------- */
  startOrientationTracking() {
    window.addEventListener("deviceorientation", (e) => {
      this.updateOrientation(e.alpha || 0);
      this.updateTilt(e.beta || 0, e.gamma || 0);
    });
  }

  updateOrientation(alpha) {
    this.orientation.degrees = alpha;
    this.orientation.cardinal = this.getCardinal(alpha);
  }

  updateTilt(beta, gamma) {
    this.tilt.beta = this.normalizeTilt(beta);
    this.tilt.gamma = this.normalizeTilt(gamma);
  }

  normalizeTilt(value) {
    if (value === null) return 0;
    let normalized = 1 - Math.abs(value / 90);
    if (value < 0) normalized *= -1;
    return normalized.toFixed(2);
  }

  getCardinal(deg) {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    return dirs[Math.round(deg / 45)];
  }

  /* ---------- ORIENTACIÓ DE PANTALLA ---------- */
  startScreenTracking() {
    window.addEventListener("resize", () => {
      this.updateScreenMode();
    });
  }

  updateScreenMode() {
    this.screen.mode = this.getScreenMode();
  }

  getScreenMode() {
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  }
}
