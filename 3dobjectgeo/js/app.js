import { ARScene } from './ARScene.js';
import { CameraManager } from './CameraManager.js';
import { GeolocationManager } from './GeolocationManager.js';
import { DeviceOrientationManager } from './DeviceOrientationManager.js';

/**
 * Aplicació principal d'AR Geolocalitzada
 */
class ARApp {
  constructor() {
    // Configuració
    this.targetLat = 41.631736995249575;
    this.targetLon = 0.7782826945720215;
    this.visibilityDistance = 50; // metres

    // Elements del DOM
    this.info = document.getElementById("info");
    this.geoBtn = document.getElementById("geoBtn");
    this.camBtn = document.getElementById("camBtn");
    this.videoElement = document.getElementById("videoBackground");
    this.directionIndicator = document.getElementById("directionIndicator");
    this.distanceLabel = document.getElementById("distanceLabel");

    // Managers
    this.arScene = new ARScene();
    this.cameraManager = new CameraManager(this.videoElement);
    this.geoManager = new GeolocationManager();
    this.orientationManager = null; // S'inicialitzarà després de crear la càmera

    // Estat
    this.isRunning = false;

    this.init();
  }

  /**
   * Inicialitza l'aplicació
   */
  init() {
    // Configurar esdeveniments dels botons
    this.geoBtn.addEventListener("click", () => this.activateGeolocation());
    this.camBtn.addEventListener("click", () => this.activateCamera());
  }

  /**
   * Activa la geolocalització
   */
  activateGeolocation() {
    this.geoManager.startTracking(
      () => {
        // Succés
      },
      (err) => {
        this.info.innerText = "Permís GPS denegat";
      }
    );

    this.info.innerText = "Geolocalització activada!";
    this.geoBtn.style.display = "none";
    this.camBtn.style.display = "block";
  }

  /**
   * Activa la càmera i inicia l'AR
   */
  async activateCamera() {
    this.camBtn.style.display = "none";
    this.info.innerText = "Iniciant càmera i sensors...";

    try {
      // Activar càmera
      await this.cameraManager.start();

      // Inicialitzar escena AR
      this.arScene.init();

      // Inicialitzar gestor d'orientació
      this.orientationManager = new DeviceOrientationManager(this.arScene.getCamera());
      const orientationGranted = await this.orientationManager.init();

      if (!orientationGranted) {
        this.info.innerText = "⚠️ Permís d'orientació denegat - l'AR pot no funcionar correctament";
      } else {
        this.info.innerText = "✅ AR iniciada - Mou el dispositiu";
      }

      // Carregar model 3D
      this.arScene.loadModel(
        "test.glb",
        (model) => {
          console.log("📦 Posició model:", model.position);
          console.log("📏 Escala model:", model.scale);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Carregant model: ${percent.toFixed(0)}%`);
        },
        (error) => {
          this.info.innerText = "Error: No s'ha pogut carregar el model 3D";
        }
      );

      // Iniciar bucle d'animació
      this.isRunning = true;
      this.animate();

    } catch (err) {
      this.info.innerText = "Error: " + err.message;
      console.error(err);
    }
  }

  /**
   * Bucle d'animació principal
   */
  animate() {
    if (!this.isRunning) return;

    requestAnimationFrame(() => this.animate());

    // Actualitzar orientació de la càmera
    if (this.orientationManager) {
      this.orientationManager.update();
    }

    // Actualitzar posició del model segons GPS
    const userPos = this.geoManager.getUserPosition();
    const model = this.arScene.getModel();

    if (userPos && model) {
      const meters = this.geoManager.latLonToMeters(
        userPos.latitude,
        userPos.longitude,
        this.targetLat,
        this.targetLon
      );

      const distance = Math.sqrt(meters.x ** 2 + meters.z ** 2);
      const visible = distance <= this.visibilityDistance;

      // Actualitzar posició del model
      this.arScene.updateModelPosition(distance, visible);

      // Actualitzar indicador de direcció
      this.updateDirectionIndicator(distance, visible);

      // Actualitzar informació de debug
      this.updateInfo(distance, visible, userPos.accuracy);
    }

    // Renderitzar escena
    this.arScene.render();
  }

  /**
   * Actualitza l'indicador de direcció
   */
  updateDirectionIndicator(distance, visible) {
    if (!this.directionIndicator) return;

    // Mostrar només si l'objecte NO és visible (està fora de rang)
    if (visible) {
      this.directionIndicator.style.display = 'none';
      return;
    }

    this.directionIndicator.style.display = 'block';

    // Calcular bearing cap a l'objectiu
    const bearing = this.geoManager.getBearingToTarget(this.targetLat, this.targetLon);
    
    if (bearing !== null && this.orientationManager) {
      // Obtenir l'orientació actual del dispositiu (alpha = compass heading)
      const deviceHeading = this.orientationManager.deviceOrientation.alpha || 0;
      
      // Calcular l'angle relatiu (diferència entre on apunta el dispositiu i on està l'objectiu)
      const relativeAngle = bearing - deviceHeading;
      
      // Rotar la fletxa
      this.directionIndicator.style.transform = 
        `translateX(-50%) rotate(${relativeAngle}deg)`;
      
      // Actualitzar etiqueta de distància
      this.distanceLabel.textContent = `${Math.round(distance)} m`;
    }
  }

  /**
   * Actualitza la informació de debug
   */
  updateInfo(distance, visible, accuracy) {
    const accuracyText = accuracy ? accuracy.toFixed(1) : 'N/A';

    if (visible) {
      this.info.innerHTML = 
        `✅ <strong>Objecte visible!</strong><br>` +
        `📍 Distància: ${Math.round(distance)} m<br>` +
        `📦 Posició: (0, 0, ${-distance.toFixed(1)})<br>` +
        `📡 Precisió GPS: ±${accuracyText} m`;
    } else {
      this.info.innerHTML = 
        `📍 Distància: ${Math.round(distance)} m<br>` +
        `⚠️ Fora de rang (màx ${this.visibilityDistance}m)<br>` +
        `📡 Precisió GPS: ±${accuracyText} m<br>` +
        `👣 Apropa't per veure l'objecte`;
    }
  }
}

// Iniciar l'aplicació quan el DOM estigui carregat
document.addEventListener('DOMContentLoaded', () => {
  new ARApp();
});
