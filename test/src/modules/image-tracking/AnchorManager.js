/**
 * AnchorManager - Gestió de contingut ancrat a targets
 * Transformacions i escales d'objectes 3D
 */
export class AnchorManager {
  constructor() {
    this.anchors = new Map();
  }

  /**
   * Crea un nou anchor
   */
  createAnchor(id, targetIndex, group) {
    if (this.anchors.has(id)) {
      console.warn(`Anchor ${id} already exists`);
      return this.anchors.get(id);
    }

    const anchor = {
      id,
      targetIndex,
      group, // THREE.Group de MindAR
      objects: [],
      visible: false,
      scale: 1,
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 0 }
    };

    this.anchors.set(id, anchor);
    console.log(`Anchor ${id} created for target ${targetIndex}`);
    
    return anchor;
  }

  /**
   * Afegeix un objecte a un anchor
   */
  addObject(anchorId, object) {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) {
      console.error(`Anchor ${anchorId} not found`);
      return;
    }

    anchor.objects.push(object);
    anchor.group.add(object);
    
    // Aplica transformacions existents
    this.applyTransformations(anchorId);
  }

  /**
   * Elimina un objecte d'un anchor
   */
  removeObject(anchorId, object) {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return;

    const index = anchor.objects.indexOf(object);
    if (index > -1) {
      anchor.objects.splice(index, 1);
      anchor.group.remove(object);
    }
  }

  /**
   * Estableix l'escala d'un anchor
   */
  setScale(anchorId, scale) {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return;

    anchor.scale = scale;
    anchor.group.scale.set(scale, scale, scale);
  }

  /**
   * Estableix la rotació d'un anchor
   */
  setRotation(anchorId, x, y, z) {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return;

    anchor.rotation = { x, y, z };
    anchor.group.rotation.set(x, y, z);
  }

  /**
   * Estableix la posició d'un anchor
   */
  setPosition(anchorId, x, y, z) {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return;

    anchor.position = { x, y, z };
    anchor.group.position.set(x, y, z);
  }

  /**
   * Aplica les transformacions a un anchor
   */
  applyTransformations(anchorId) {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return;

    anchor.group.scale.set(anchor.scale, anchor.scale, anchor.scale);
    anchor.group.rotation.set(anchor.rotation.x, anchor.rotation.y, anchor.rotation.z);
    anchor.group.position.set(anchor.position.x, anchor.position.y, anchor.position.z);
  }

  /**
   * Mostra o amaga un anchor
   */
  setVisible(anchorId, visible) {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return;

    anchor.visible = visible;
    anchor.group.visible = visible;
  }

  /**
   * Obté un anchor
   */
  getAnchor(anchorId) {
    return this.anchors.get(anchorId);
  }

  /**
   * Elimina un anchor
   */
  removeAnchor(anchorId) {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return;

    // Elimina tots els objectes
    anchor.objects.forEach(obj => {
      anchor.group.remove(obj);
      // Neteja geometries i materials
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    this.anchors.delete(anchorId);
    console.log(`Anchor ${anchorId} removed`);
  }

  /**
   * Neteja tots els anchors
   */
  clear() {
    this.anchors.forEach((anchor, id) => {
      this.removeAnchor(id);
    });
    this.anchors.clear();
  }
}
