/**
 * main.js - Punt d'entrada de l'aplicació
 * Registre d'experiències i gestió de navegació
 */
import { BellocExperience } from './experiences/BellocExperience.js';
import { PeixosExperience } from './experiences/PeixosExperience.js';
import { PenellesExperience } from './experiences/PenellesExperience.js';
import { GeolocationExperience } from './experiences/GeolocationExperience.js';
import { Object3DGeoExperience } from './experiences/Object3DGeoExperience.js';
import { experiencesConfig } from './config/experiences.config.js';
import { LoadingScreen } from './modules/ui/LoadingScreen.js';
import { logger } from './utils/Logger.js';

class App {
  constructor() {
    this.currentExperience = null;
    this.experiences = new Map();
    this.loadingScreen = new LoadingScreen();
  }

  /**
   * Registra totes les experiències
   */
  registerExperiences() {
    if (experiencesConfig.belloc.enabled) {
      this.experiences.set('belloc', new BellocExperience(experiencesConfig.belloc));
    }

    if (experiencesConfig.peixos.enabled) {
      this.experiences.set('peixos', new PeixosExperience(experiencesConfig.peixos));
    }

    if (experiencesConfig.penelles.enabled) {
      this.experiences.set('penelles', new PenellesExperience(experiencesConfig.penelles));
    }

    if (experiencesConfig.geolocation.enabled) {
      this.experiences.set('geolocation', new GeolocationExperience(experiencesConfig.geolocation));
    }

    if (experiencesConfig.object3dgeo.enabled) {
      this.experiences.set('object3dgeo', new Object3DGeoExperience(experiencesConfig.object3dgeo));
    }

    logger.info(`Registered ${this.experiences.size} experiences`);
  }

  /**
   * Carrega una experiència
   */
  async loadExperience(id) {
    try {
      // Mostra loading screen
      this.loadingScreen.show(`Loading ${id}...`);
      this.loadingScreen.updateProgress(0);

      // Atura experiència actual si existeix
      if (this.currentExperience) {
        logger.info('Stopping current experience');
        await this.currentExperience.stop();
        this.currentExperience.destroy();
      }

      const experience = this.experiences.get(id);
      
      if (!experience) {
        throw new Error(`Experience "${id}" not found`);
      }

      logger.info(`Loading experience: ${id}`);
      this.currentExperience = experience;

      // Inicialitza
      this.loadingScreen.updateProgress(30, 'Initializing...');
      await experience.init();

      this.loadingScreen.updateProgress(70, 'Starting...');
      await experience.start();

      this.loadingScreen.updateProgress(100, 'Ready!');
      
      // Amaga loading després d'un moment
      setTimeout(() => {
        this.loadingScreen.hide();
      }, 500);

      logger.info(`Experience ${id} loaded successfully`);

    } catch (error) {
      logger.error('Error loading experience:', error);
      this.loadingScreen.setMessage('Error loading experience');
      
      setTimeout(() => {
        this.loadingScreen.hide();
        this.showExperienceSelector();
      }, 2000);
    }
  }

  /**
   * Mostra el selector d'experiències
   */
  showExperienceSelector() {
    const selector = document.getElementById('experience-selector');
    if (selector) {
      selector.style.display = 'flex';
    }
  }

  /**
   * Amaga el selector d'experiències
   */
  hideExperienceSelector() {
    const selector = document.getElementById('experience-selector');
    if (selector) {
      selector.style.display = 'none';
    }
  }

  /**
   * Configura els event listeners del selector
   */
  setupExperienceSelector() {
    const buttons = document.querySelectorAll('.experience-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const experienceId = button.dataset.experience;
        this.hideExperienceSelector();
        this.loadExperience(experienceId);
      });
    });

    // Back button
    const backButton = document.getElementById('back-btn');
    if (backButton) {
      backButton.addEventListener('click', () => {
        if (this.currentExperience) {
          this.currentExperience.stop();
          this.currentExperience.destroy();
          this.currentExperience = null;
        }
        this.showExperienceSelector();
      });
    }
  }

  /**
   * Inicialitza l'aplicació
   */
  init() {
    logger.info('NUBULUS WebXR App starting...');

    // Crea loading screen
    this.loadingScreen.create();

    // Registra experiències
    this.registerExperiences();

    // Configura selector
    this.setupExperienceSelector();

    // Detecta experiència des de URL
    const urlParams = new URLSearchParams(window.location.search);
    const experienceId = urlParams.get('exp');

    if (experienceId && this.experiences.has(experienceId)) {
      logger.info(`Auto-loading experience from URL: ${experienceId}`);
      this.hideExperienceSelector();
      this.loadExperience(experienceId);
    } else {
      // Mostra selector
      this.showExperienceSelector();
    }

    logger.info('App initialized');
  }
}

// Inicia l'app quan el DOM estigui carregat
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

// Exporta per debug
window.NUBULUSApp = App;
