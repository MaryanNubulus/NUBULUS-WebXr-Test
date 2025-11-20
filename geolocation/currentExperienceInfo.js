export class CurrentExperienceInfo {
  constructor() {
    this.location = { lat: 41.231, lon: 1.123 };
    this.orientationDegrees = 120;
    this.beta = 0; // valor entre -1 i 1
    this.gamma = 0; // valor entre -1 i 1
    this.geofence = [
      { lat: 41.23, lon: 1.12 },
      { lat: 41.24, lon: 1.12 },
      { lat: 41.24, lon: 1.13 },
      { lat: 41.23, lon: 1.13 },
    ];
  }

  get orientation() {
    return {
      degrees: this.orientationDegrees,
      cardinal: this.getCardinal(this.orientationDegrees),
    };
  }

  getCardinal(deg) {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    return dirs[Math.round(deg / 45)];
  }
}
