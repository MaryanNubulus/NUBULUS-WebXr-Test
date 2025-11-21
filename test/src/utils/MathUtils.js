/**
 * MathUtils - Funcions matemàtiques utilities
 * Conversions d'angles, interpolacions, etc.
 */
export class MathUtils {
  /**
   * Converteix graus a radians
   */
  static degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
   * Converteix radians a graus
   */
  static radToDeg(radians) {
    return radians * 180 / Math.PI;
  }

  /**
   * Normalitza un angle a 0-360
   */
  static normalizeAngle(angle) {
    angle = angle % 360;
    if (angle < 0) angle += 360;
    return angle;
  }

  /**
   * Interpola linealment entre dos valors
   */
  static lerp(start, end, t) {
    return start + (end - start) * t;
  }

  /**
   * Clamp - limita un valor entre min i max
   */
  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Map - mapeja un valor d'un rang a un altre
   */
  static map(value, inMin, inMax, outMin, outMax) {
    return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
  }

  /**
   * Calcula la distància entre dos punts 2D
   */
  static distance2D(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calcula la distància entre dos punts 3D
   */
  static distance3D(x1, y1, z1, x2, y2, z2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Smoothstep - interpolació suau
   */
  static smoothstep(edge0, edge1, x) {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  /**
   * Easing functions
   */
  static easeInQuad(t) {
    return t * t;
  }

  static easeOutQuad(t) {
    return t * (2 - t);
  }

  static easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Genera un número aleatori entre min i max
   */
  static random(min = 0, max = 1) {
    return min + Math.random() * (max - min);
  }

  /**
   * Genera un número aleatori enter
   */
  static randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Arrodoneix un número a N decimals
   */
  static roundTo(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}
