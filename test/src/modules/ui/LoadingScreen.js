/**
 * LoadingScreen - Pantalla de càrrega
 * Indicador de progrés per càrrega d'assets
 */
export class LoadingScreen {
  constructor(containerId = 'loading-screen') {
    this.containerId = containerId;
    this.container = null;
    this.progressBar = null;
    this.progressText = null;
    this.messageElement = null;
    this.isVisible = false;
  }

  /**
   * Crea la pantalla de càrrega
   */
  create() {
    this.container = document.createElement('div');
    this.container.id = this.containerId;
    this.container.className = 'loading-screen';

    // Estils del container
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.background = 'rgba(0, 0, 0, 0.9)';
    this.container.style.display = 'none';
    this.container.style.justifyContent = 'center';
    this.container.style.alignItems = 'center';
    this.container.style.flexDirection = 'column';
    this.container.style.zIndex = '99999';
    this.container.style.color = '#fff';

    // Wrapper del contingut
    const wrapper = document.createElement('div');
    wrapper.style.textAlign = 'center';
    wrapper.style.maxWidth = '400px';
    wrapper.style.padding = '20px';

    // Missatge
    this.messageElement = document.createElement('div');
    this.messageElement.className = 'loading-message';
    this.messageElement.textContent = 'Loading...';
    this.messageElement.style.fontSize = '24px';
    this.messageElement.style.marginBottom = '20px';
    this.messageElement.style.fontWeight = 'bold';

    // Progress bar container
    const progressContainer = document.createElement('div');
    progressContainer.style.width = '100%';
    progressContainer.style.height = '30px';
    progressContainer.style.background = 'rgba(255, 255, 255, 0.1)';
    progressContainer.style.borderRadius = '15px';
    progressContainer.style.overflow = 'hidden';
    progressContainer.style.marginBottom = '10px';

    // Progress bar
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'progress-bar';
    this.progressBar.style.width = '0%';
    this.progressBar.style.height = '100%';
    this.progressBar.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
    this.progressBar.style.transition = 'width 0.3s ease';

    progressContainer.appendChild(this.progressBar);

    // Progress text
    this.progressText = document.createElement('div');
    this.progressText.className = 'progress-text';
    this.progressText.textContent = '0%';
    this.progressText.style.fontSize = '14px';
    this.progressText.style.marginTop = '10px';

    // Spinner (opcional)
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.marginTop = '20px';
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '5px solid rgba(255, 255, 255, 0.3)';
    spinner.style.borderTop = '5px solid #fff';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    spinner.style.margin = '20px auto 0';

    // Afegeix keyframes per l'animació
    this.addSpinnerAnimation();

    wrapper.appendChild(this.messageElement);
    wrapper.appendChild(progressContainer);
    wrapper.appendChild(this.progressText);
    wrapper.appendChild(spinner);

    this.container.appendChild(wrapper);
    document.body.appendChild(this.container);

    console.log('LoadingScreen created');
  }

  /**
   * Afegeix l'animació del spinner
   */
  addSpinnerAnimation() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Mostra la pantalla de càrrega
   */
  show(message = 'Loading...') {
    if (!this.container) {
      this.create();
    }

    this.messageElement.textContent = message;
    this.container.style.display = 'flex';
    this.isVisible = true;
  }

  /**
   * Amaga la pantalla de càrrega
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.isVisible = false;
    }
  }

  /**
   * Actualitza el progrés (0-100)
   */
  updateProgress(percent, message = null) {
    const clampedPercent = Math.max(0, Math.min(100, percent));
    
    if (this.progressBar) {
      this.progressBar.style.width = `${clampedPercent}%`;
    }

    if (this.progressText) {
      this.progressText.textContent = `${Math.round(clampedPercent)}%`;
    }

    if (message && this.messageElement) {
      this.messageElement.textContent = message;
    }
  }

  /**
   * Estableix un missatge
   */
  setMessage(message) {
    if (this.messageElement) {
      this.messageElement.textContent = message;
    }
  }

  /**
   * Destrueix la pantalla de càrrega
   */
  destroy() {
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.progressBar = null;
      this.progressText = null;
      this.messageElement = null;
    }
  }
}
