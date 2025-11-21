/**
 * GeofenceUtils - Utilitats per geofencing i càlculs GPS
 * Algoritme Haversine, point-in-polygon, bearing
 */
export class GeofenceUtils {
  /**
   * Verifica si un punt està dins d'un polígon (Ray Casting Algorithm)
   */
  static isInsidePolygon(point, polygon) {
    const { lat, lon } = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lon;
      const yi = polygon[i].lat;
      const xj = polygon[j].lon;
      const yj = polygon[j].lat;

      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);

      if (intersect) inside = !inside;
    }

    return inside;
  }

  /**
   * Calcula la distància entre dos punts GPS (Haversine)
   * Retorna la distància en metres
   */
  static haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radi de la Terra en metres
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  /**
   * Calcula el bearing (direcció) d'un punt a un altre
   * Retorna l'angle en graus (0-360)
   */
  static bearingTo(lat1, lon1, lat2, lon2) {
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    
    // Normalitza a 0-360
    return (bearing + 360) % 360;
  }

  /**
   * Crea un geofence circular com a polígon
   */
  static createCircleGeofence(center, radius, points = 32) {
    const polygon = [];
    const R = 6371000; // Radi de la Terra en metres

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      
      // Calcula el desplaçament en metres
      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);
      
      // Converteix a coordenades GPS
      const lat = center.lat + (dy / R) * (180 / Math.PI);
      const lon = center.lon + (dx / R) * (180 / Math.PI) / 
                  Math.cos(center.lat * Math.PI / 180);
      
      polygon.push({ lat, lon });
    }

    return polygon;
  }

  /**
   * Converteix coordenades GPS a metres (relatiu a un punt)
   */
  static latLonToMeters(userLat, userLon, targetLat, targetLon) {
    const R = 6371000; // Radi de la Terra en metres
    
    const dLat = (targetLat - userLat) * Math.PI / 180;
    const dLon = (targetLon - userLon) * Math.PI / 180;
    
    const latRad = userLat * Math.PI / 180;
    
    const x = dLon * R * Math.cos(latRad);
    const z = dLat * R;
    
    return { x, z };
  }

  /**
   * Calcula el punt central d'un conjunt de coordenades
   */
  static getCenterPoint(coordinates) {
    if (coordinates.length === 0) return null;

    let sumLat = 0;
    let sumLon = 0;

    coordinates.forEach(coord => {
      sumLat += coord.lat;
      sumLon += coord.lon;
    });

    return {
      lat: sumLat / coordinates.length,
      lon: sumLon / coordinates.length
    };
  }

  /**
   * Verifica si un punt està dins d'un radi
   */
  static isWithinRadius(point, center, radius) {
    const distance = this.haversineDistance(
      point.lat, point.lon,
      center.lat, center.lon
    );
    return distance <= radius;
  }
}
