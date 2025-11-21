/**
 * StatusDisplay - Visualització d'estat del dispositiu
 * Informació de debug i telemetria
 */
export class StatusDisplay {
  constructor(containerId = 'status-display') {
    this.containerId = containerId;
    this.container = null;
    this.elements = {};
    this.isVisible = true;
  }

  /**
   * Crea el display
   */
  create() {
    // Busca o crea el container
    this.container = document.getElementById(this.containerId);
    
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = this.containerId;
      this.container.className = 'status-display';
      document.body.appendChild(this.container);
    }

    // Aplica estils per defecte
    this.applyDefaultStyles();

    console.log('StatusDisplay created');
  }

  /**
   * Aplica estils per defecte
   */
  applyDefaultStyles() {
    this.container.style.position = 'fixed';
    this.container.style.top = '10px';
    this.container.style.left = '10px';
    this.container.style.background = 'rgba(0, 0, 0, 0.7)';
    this.container.style.color = '#fff';
    this.container.style.padding = '10px';
    this.container.style.fontFamily = 'monospace';
    this.container.style.fontSize = '12px';
    this.container.style.borderRadius = '5px';
    this.container.style.zIndex = '10000';
    this.container.style.maxWidth = '300px';
  }

  /**
   * Afegeix un element
   */
  addElement(key, label, initialValue = '') {
    const element = document.createElement('div');
    element.className = 'status-item';
    element.innerHTML = `<strong>${label}:</strong> <span id="status-${key}">${initialValue}</span>`;
    
    this.container.appendChild(element);
    this.elements[key] = element.querySelector(`#status-${key}`);
    
    return this.elements[key];
  }

  /**
   * Actualitza un element
   */
  update(key, value) {
    if (this.elements[key]) {
      this.elements[key].textContent = value;
    } else {
      console.warn(`Status element "${key}" not found`);
    }
  }

  /**
   * Actualitza múltiples elements
   */
  updateMultiple(data) {
    Object.keys(data).forEach(key => {
      this.update(key, data[key]);
    });
  }

  /**
   * Mostra el display
   */
  show() {
    if (this.container) {
      this.container.style.display = 'block';
      this.isVisible = true;
    }
  }

  /**
   * Amaga el display
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.isVisible = false;
    }
  }

  /**
   * Toggle visibilitat
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Neteja tots els elements
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
      this.elements = {};
    }
  }

  /**
   * Destrueix el display
   */
  destroy() {
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.elements = {};
    }
  }
}
