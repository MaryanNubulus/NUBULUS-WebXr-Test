/**
 * GeometryBuilder - Constructor de geometries Three.js
 * Creació de planes amb aspect ratio, custom shapes, etc.
 */
export class GeometryBuilder {
  /**
   * Crea un PlaneGeometry amb aspect ratio ajustat
   */
  static createPlaneWithAspectRatio(video, scale = 1) {
    let aspectRatio = 16 / 9; // default

    if (video && video.videoWidth && video.videoHeight) {
      aspectRatio = video.videoWidth / video.videoHeight;
    }

    const width = aspectRatio * scale;
    const height = scale;

    const geometry = new THREE.PlaneGeometry(width, height);
    return geometry;
  }

  /**
   * Crea una geometria personalitzada (polígon irregular)
   */
  static createCustomShape(points, uvMapping = 'automatic') {
    if (points.length < 3) {
      throw new Error('Need at least 3 points to create a shape');
    }

    const shape = new THREE.Shape();

    // Mou al primer punt
    shape.moveTo(points[0].x, points[0].y);

    // Dibuixa les línies
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }

    // Tanca el shape
    shape.lineTo(points[0].x, points[0].y);

    const geometry = new THREE.ShapeGeometry(shape);

    // Aplica UV mapping si és personalitzat
    if (uvMapping === 'custom' && points.length > 0) {
      this.applyCustomUVMapping(geometry, points);
    }

    return geometry;
  }

  /**
   * Aplica UV mapping personalitzat a una geometria
   */
  static applyCustomUVMapping(geometry, points) {
    const uvs = [];

    // Converteix els punts normalitzats (0-1) a UVs
    points.forEach(point => {
      uvs.push(point.x, point.y);
    });

    // Afegeix UVs per cada vèrtex
    const uvAttribute = new THREE.Float32BufferAttribute(uvs, 2);
    geometry.setAttribute('uv', uvAttribute);
  }

  /**
   * Crea una esfera
   */
  static createSphere(radius = 1, widthSegments = 32, heightSegments = 16) {
    return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  }

  /**
   * Crea un cub/box
   */
  static createBox(width = 1, height = 1, depth = 1) {
    return new THREE.BoxGeometry(width, height, depth);
  }

  /**
   * Crea un cilindre
   */
  static createCylinder(radiusTop = 1, radiusBottom = 1, height = 1, radialSegments = 32) {
    return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  }

  /**
   * Crea un con
   */
  static createCone(radius = 1, height = 1, radialSegments = 32) {
    return new THREE.ConeGeometry(radius, height, radialSegments);
  }

  /**
   * Crea un anell
   */
  static createRing(innerRadius = 0.5, outerRadius = 1, thetaSegments = 32) {
    return new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
  }

  /**
   * Crea un text 3D (requereix TextGeometry del THREE)
   */
  static createText(text, font, options = {}) {
    if (!THREE.TextGeometry) {
      throw new Error('TextGeometry not available. Include it in your THREE.js build.');
    }

    const config = {
      font: font,
      size: options.size || 1,
      height: options.height || 0.2,
      curveSegments: options.curveSegments || 12,
      bevelEnabled: options.bevelEnabled || false,
      bevelThickness: options.bevelThickness || 0.03,
      bevelSize: options.bevelSize || 0.02,
      bevelOffset: options.bevelOffset || 0,
      bevelSegments: options.bevelSegments || 5
    };

    return new THREE.TextGeometry(text, config);
  }
}
