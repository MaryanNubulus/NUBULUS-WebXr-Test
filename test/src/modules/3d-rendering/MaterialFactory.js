/**
 * MaterialFactory - Factory per crear materials Three.js
 * Materials per vídeo, bàsics i estàndard
 */
export class MaterialFactory {
  /**
   * Crea un material per vídeo
   */
  static createVideoMaterial(texture, options = {}) {
    const config = {
      map: texture,
      side: options.side || THREE.DoubleSide,
      transparent: options.transparent !== undefined ? options.transparent : false,
      opacity: options.opacity || 1.0,
      ...options
    };

    return new THREE.MeshBasicMaterial(config);
  }

  /**
   * Crea un material bàsic
   */
  static createBasicMaterial(options = {}) {
    const config = {
      color: options.color || 0xffffff,
      side: options.side || THREE.FrontSide,
      transparent: options.transparent || false,
      opacity: options.opacity || 1.0,
      wireframe: options.wireframe || false,
      ...options
    };

    return new THREE.MeshBasicMaterial(config);
  }

  /**
   * Crea un material estàndard (amb lighting)
   */
  static createStandardMaterial(options = {}) {
    const config = {
      color: options.color || 0xffffff,
      roughness: options.roughness || 0.5,
      metalness: options.metalness || 0.5,
      side: options.side || THREE.FrontSide,
      transparent: options.transparent || false,
      opacity: options.opacity || 1.0,
      map: options.map || null,
      normalMap: options.normalMap || null,
      roughnessMap: options.roughnessMap || null,
      metalnessMap: options.metalnessMap || null,
      ...options
    };

    return new THREE.MeshStandardMaterial(config);
  }

  /**
   * Crea un material Lambert (lighting bàsic)
   */
  static createLambertMaterial(options = {}) {
    const config = {
      color: options.color || 0xffffff,
      side: options.side || THREE.FrontSide,
      transparent: options.transparent || false,
      opacity: options.opacity || 1.0,
      emissive: options.emissive || 0x000000,
      ...options
    };

    return new THREE.MeshLambertMaterial(config);
  }

  /**
   * Crea un material Phong (lighting avançat)
   */
  static createPhongMaterial(options = {}) {
    const config = {
      color: options.color || 0xffffff,
      specular: options.specular || 0x111111,
      shininess: options.shininess || 30,
      side: options.side || THREE.FrontSide,
      transparent: options.transparent || false,
      opacity: options.opacity || 1.0,
      ...options
    };

    return new THREE.MeshPhongMaterial(config);
  }

  /**
   * Crea un material físic (PBR)
   */
  static createPhysicalMaterial(options = {}) {
    const config = {
      color: options.color || 0xffffff,
      roughness: options.roughness || 0.5,
      metalness: options.metalness || 0.5,
      clearcoat: options.clearcoat || 0.0,
      clearcoatRoughness: options.clearcoatRoughness || 0.0,
      side: options.side || THREE.FrontSide,
      transparent: options.transparent || false,
      opacity: options.opacity || 1.0,
      ...options
    };

    return new THREE.MeshPhysicalMaterial(config);
  }

  /**
   * Crea un material per shaders personalitzats
   */
  static createShaderMaterial(vertexShader, fragmentShader, uniforms = {}) {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });
  }

  /**
   * Crea un material de línies
   */
  static createLineMaterial(options = {}) {
    const config = {
      color: options.color || 0xffffff,
      linewidth: options.linewidth || 1,
      ...options
    };

    return new THREE.LineBasicMaterial(config);
  }

  /**
   * Crea un material de punts
   */
  static createPointsMaterial(options = {}) {
    const config = {
      color: options.color || 0xffffff,
      size: options.size || 1.0,
      sizeAttenuation: options.sizeAttenuation !== undefined ? options.sizeAttenuation : true,
      ...options
    };

    return new THREE.PointsMaterial(config);
  }
}
