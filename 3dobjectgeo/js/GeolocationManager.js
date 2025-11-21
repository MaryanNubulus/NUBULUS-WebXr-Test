/**
 * Gestiona la geolocalització de l'usuari
 */
export class GeolocationManager {
  constructor() {
    this.userPosition = null;
    this.watchId = null;
  }

  /**
   * Inicia el seguiment de la posició de l'usuari
   */
  startTracking(onSuccess, onError) {
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.userPosition = pos.coords;
        console.log(
          `📍 Posició: ${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`
        );
        if (onSuccess) onSuccess(pos.coords);
      },
      (err) => {
        console.error("Error GPS:", err);
        if (onError) onError(err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );
  }

  /**
   * Atura el seguiment de la posició
   */
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Converteix coordenades lat/lon a metres respecte a la posició de l'usuari
   */
  latLonToMeters(userLat, userLon, objLat, objLon) {
    const R = 6371000; // Radi de la Terra en metres
    const dLat = ((objLat - userLat) * Math.PI) / 180;
    const dLon = ((objLon - userLon) * Math.PI) / 180;
    const latRad = (userLat * Math.PI) / 180;
    const x = dLon * R * Math.cos(latRad);
    const z = dLat * R;
    return { x, z };
  }

  /**
   * Calcula la distància entre l'usuari i un objectiu
   */
  getDistanceToTarget(targetLat, targetLon) {
    if (!this.userPosition) return null;

    const meters = this.latLonToMeters(
      this.userPosition.latitude,
      this.userPosition.longitude,
      targetLat,
      targetLon
    );

    return Math.sqrt(meters.x ** 2 + meters.z ** 2);
  }

  /**
   * Obté la posició actual de l'usuari
   */
  getUserPosition() {
    return this.userPosition;
  }

  /**
   * Calcula el bearing (direcció en graus) des de la posició actual cap a l'objectiu
   * @returns {number} Angle en graus (0-360) on 0 és Nord, 90 és Est, etc.
   */
  getBearingToTarget(targetLat, targetLon) {
    if (!this.userPosition) return null;

    const lat1 = (this.userPosition.latitude * Math.PI) / 180;
    const lat2 = (targetLat * Math.PI) / 180;
    const dLon = ((targetLon - this.userPosition.longitude) * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - 
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360; // Normalitzar a 0-360

    return bearing;
  }
}
