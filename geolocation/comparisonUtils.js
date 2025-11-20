export class ComparisonUtils {
  static isInsideGeofence(devicePos, geofence) {
    const { lat, lon } = devicePos;
    const inside = ComparisonUtils.pointInPolygon({ lat, lon }, geofence);

    if (inside) return { inside: true, meters: 0 };
    const distances = geofence.map((p) =>
      ComparisonUtils.haversineDistance(lat, lon, p.lat, p.lon)
    );
    const minDist = Math.min(...distances);
    return { inside: false, meters: minDist };
  }

  static compareOrientation(deviceDeg, expDeg) {
    let diff = (expDeg - deviceDeg + 360) % 360;
    if (diff < 10 || diff > 350) return "ok";
    if (diff < 180) return "right";
    return "left";
  }

  static compareTilt(deviceTilt, screenMode) {
    const value =
      screenMode === "portrait" ? deviceTilt.beta : deviceTilt.gamma;
    if (Math.abs(value) <= 0.05) return "ok";
    return value > 0 ? "down" : "up";
  }

  // ---------- Funcions internes ----------
  static haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static pointInPolygon(point, vs) {
    const x = point.lon,
      y = point.lat;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].lon,
        yi = vs[i].lat;
      const xj = vs[j].lon,
        yj = vs[j].lat;
      const intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
}
