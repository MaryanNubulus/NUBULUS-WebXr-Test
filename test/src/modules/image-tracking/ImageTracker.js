/**
 * ImageTracker - Wrapper per MindAR Image Tracking
 * Gestió d'anchors i configuració de filtres
 */
export class ImageTracker {
  constructor(targetSrc, config = {}) {
    this.targetSrc = targetSrc;
    this.mindarThree = null;
    this.anchors = [];
    this.config = {
      filterMinCF: 0.8,
      filterBeta: 0.8,
      warmupTolerance: 5,
      missTolerance: 5,
      ...config,
    };
    this.container = null;
  }

  /**
   * Inicialitza MindAR
   */
  async init(container) {
    if (!window.MINDAR || !window.MINDAR.IMAGE) {
      throw new Error('MindAR library not loaded');
    }

    this.container = container;

    // Crea instància de MindARThree
    this.mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: this.container,
      imageTargetSrc: this.targetSrc,
      filterMinCF: this.config.filterMinCF,
      filterBeta: this.config.filterBeta,
      warmupTolerance: this.config.warmupTolerance,
      missTolerance: this.config.missTolerance,
    });

    console.log('ImageTracker initialized');
  }

  /**
   * Afegeix un anchor a un target
   */
  addAnchor(targetIndex, content) {
    if (!this.mindarThree) {
      throw new Error('ImageTracker not initialized');
    }

    const anchor = this.mindarThree.addAnchor(targetIndex);
    
    // Si content és un objecte Three.js, l'afegeix directament
    if (content.geometry && content.material) {
      anchor.group.add(content);
    } else if (content.object) {
      // Si és un objecte amb configuració
      anchor.group.add(content.object);
    }

    this.anchors.push({
      index: targetIndex,
      anchor: anchor,
      content: content
    });

    return anchor;
  }

  /**
   * Obté l'escena Three.js
   */
  getScene() {
    return this.mindarThree?.scene || null;
  }

  /**
   * Obté la càmera Three.js
   */
  getCamera() {
    return this.mindarThree?.camera || null;
  }

  /**
   * Obté el renderer Three.js
   */
  getRenderer() {
    return this.mindarThree?.renderer || null;
  }

  /**
   * Registra un callback per quan es detecta un target
   */
  onTargetFound(targetIndex, callback) {
    if (!this.mindarThree) return;

    const anchor = this.anchors.find(a => a.index === targetIndex);
    if (anchor) {
      anchor.anchor.onTargetFound = callback;
    }
  }

  /**
   * Registra un callback per quan es perd un target
   */
  onTargetLost(targetIndex, callback) {
    if (!this.mindarThree) return;

    const anchor = this.anchors.find(a => a.index === targetIndex);
    if (anchor) {
      anchor.anchor.onTargetLost = callback;
    }
  }

  /**
   * Inicia el tracking
   */
  async start() {
    if (!this.mindarThree) {
      throw new Error('ImageTracker not initialized');
    }

    await this.mindarThree.start();
    console.log('ImageTracker started');
  }

  /**
   * Atura el tracking
   */
  stop() {
    if (this.mindarThree) {
      this.mindarThree.stop();
      console.log('ImageTracker stopped');
    }
  }

  /**
   * Destrueix el tracker i allibera recursos
   */
  destroy() {
    this.stop();
    this.anchors = [];
    this.mindarThree = null;
  }
}
