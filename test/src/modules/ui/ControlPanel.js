/**
 * ControlPanel - Panel de controls UI
 * Botons, sliders i controls interactius
 */
export class ControlPanel {
  constructor(containerId = 'control-panel') {
    this.containerId = containerId;
    this.container = null;
    this.buttons = new Map();
    this.sliders = new Map();
    this.isVisible = true;
  }

  /**
   * Crea el panel
   */
  create() {
    this.container = document.getElementById(this.containerId);
    
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = this.containerId;
      this.container.className = 'control-panel';
      document.body.appendChild(this.container);
    }

    this.applyDefaultStyles();
    console.log('ControlPanel created');
  }

  /**
   * Aplica estils per defecte
   */
  applyDefaultStyles() {
    this.container.style.position = 'fixed';
    this.container.style.bottom = '10px';
    this.container.style.left = '50%';
    this.container.style.transform = 'translateX(-50%)';
    this.container.style.background = 'rgba(0, 0, 0, 0.7)';
    this.container.style.color = '#fff';
    this.container.style.padding = '15px';
    this.container.style.borderRadius = '10px';
    this.container.style.zIndex = '10000';
    this.container.style.display = 'flex';
    this.container.style.gap = '10px';
    this.container.style.alignItems = 'center';
  }

  /**
   * Afegeix un botó
   */
  addButton(id, label, callback) {
    const button = document.createElement('button');
    button.id = `btn-${id}`;
    button.className = 'control-button';
    button.textContent = label;
    button.onclick = callback;

    // Estils del botó
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.fontWeight = 'bold';

    button.onmouseover = () => {
      button.style.background = '#45a049';
    };

    button.onmouseout = () => {
      button.style.background = '#4CAF50';
    };

    this.container.appendChild(button);
    this.buttons.set(id, button);

    return button;
  }

  /**
   * Afegeix un slider
   */
  addSlider(id, label, min, max, defaultValue, callback) {
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '5px';

    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.style.fontSize = '12px';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `slider-${id}`;
    slider.className = 'control-slider';
    slider.min = min;
    slider.max = max;
    slider.value = defaultValue !== undefined ? defaultValue : min;

    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = slider.value;
    valueDisplay.style.fontSize = '11px';
    valueDisplay.style.textAlign = 'center';

    slider.oninput = (e) => {
      valueDisplay.textContent = e.target.value;
      if (callback) callback(parseFloat(e.target.value));
    };

    wrapper.appendChild(labelElement);
    wrapper.appendChild(slider);
    wrapper.appendChild(valueDisplay);

    this.container.appendChild(wrapper);
    this.sliders.set(id, { slider, valueDisplay });

    return slider;
  }

  /**
   * Afegeix un toggle
   */
  addToggle(id, label, defaultValue, callback) {
    const wrapper = document.createElement('div');
    wrapper.className = 'toggle-wrapper';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '10px';

    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.style.fontSize = '12px';

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = `toggle-${id}`;
    toggle.checked = defaultValue || false;
    toggle.onchange = (e) => {
      if (callback) callback(e.target.checked);
    };

    wrapper.appendChild(labelElement);
    wrapper.appendChild(toggle);

    this.container.appendChild(wrapper);

    return toggle;
  }

  /**
   * Obté un botó
   */
  getButton(id) {
    return this.buttons.get(id);
  }

  /**
   * Obté un slider
   */
  getSlider(id) {
    return this.sliders.get(id);
  }

  /**
   * Actualitza el valor d'un slider
   */
  setSliderValue(id, value) {
    const slider = this.sliders.get(id);
    if (slider) {
      slider.slider.value = value;
      slider.valueDisplay.textContent = value;
    }
  }

  /**
   * Mostra el panel
   */
  show() {
    if (this.container) {
      this.container.style.display = 'flex';
      this.isVisible = true;
    }
  }

  /**
   * Amaga el panel
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
   * Neteja tots els controls
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
      this.buttons.clear();
      this.sliders.clear();
    }
  }

  /**
   * Destrueix el panel
   */
  destroy() {
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.buttons.clear();
      this.sliders.clear();
    }
  }
}
