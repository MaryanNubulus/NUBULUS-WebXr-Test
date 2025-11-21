/**
 * GeolocationExperience - Experiència basada en GPS i orientació
 * Geofencing i detecció d'orientació cardinal
 */
import { ExperienceManager } from '../core/ExperienceManager.js';
import { LocationTracker } from '../modules/geolocation/LocationTracker.js';
import { OrientationTracker } from '../modules/geolocation/OrientationTracker.js';
import { GeofenceUtils } from '../modules/geolocation/GeofenceUtils.js';
import { StatusDisplay } from '../modules/ui/StatusDisplay.js';

export class GeolocationExperience extends ExperienceManager {
  constructor(config) {
    super({ type: 'geolocation', name: 'Geolocation' });
    this.config = config;
    this.locationTracker = new LocationTracker();
    this.orientationTracker = new OrientationTracker();
    this.statusDisplay = new StatusDisplay();
    
    this.geofence = config.geofence.coordinates;
    this.targetLocation = config.targetLocation;
    this.targetOrientation = config.targetOrientation;
    
    this.isInsideGeofence = false;
  }

  async init() {
    await super.init();

    try {
      // Crea UI de status
      this.statusDisplay.create();
      this.statusDisplay.addElement('lat', 'Latitude', '-');
      this.statusDisplay.addElement('lon', 'Longitude', '-');
      this.statusDisplay.addElement('accuracy', 'Accuracy', '-');
      this.statusDisplay.addElement('orientation', 'Orientation', '-');
      this.statusDisplay.addElement('cardinal', 'Cardinal', '-');
      this.statusDisplay.addElement('geofence', 'Inside Geofence', 'No');
      this.statusDisplay.addElement('distance', 'Distance to Target', '-');
      this.statusDisplay.show();

      // Sol·licita permís d'orientació
      await this.orientationTracker.requestPermission();

      // Inicia tracking
      this.locationTracker.start(this.config.tracking);
      this.orientationTracker.start();

      // Callbacks
      this.locationTracker.onUpdate((position) => {
        this.onLocationUpdate(position);
      });

      this.orientationTracker.onUpdate((orientation) => {
        this.onOrientationUpdate(orientation);
      });

      this.isInitialized = true;
      console.log('GeolocationExperience initialized');
    } catch (error) {
      console.error('Error initializing GeolocationExperience:', error);
      throw error;
    }
  }

  onLocationUpdate(position) {
    // Actualitza UI
    this.statusDisplay.update('lat', position.lat.toFixed(6));
    this.statusDisplay.update('lon', position.lon.toFixed(6));
    this.statusDisplay.update('accuracy', `${position.accuracy.toFixed(1)}m`);

    // Verifica geofence
    const inside = GeofenceUtils.isInsidePolygon(
      { lat: position.lat, lon: position.lon },
      this.geofence
    );

    if (inside !== this.isInsideGeofence) {
      this.isInsideGeofence = inside;
      this.statusDisplay.update('geofence', inside ? 'Yes' : 'No');
      
      if (inside) {
        this.emit('geofence-enter', position);
        console.log('Entered geofence');
      } else {
        this.emit('geofence-exit', position);
        console.log('Exited geofence');
      }
    }

    // Calcula distància al target
    const distance = GeofenceUtils.haversineDistance(
      position.lat, position.lon,
      this.targetLocation.lat, this.targetLocation.lon
    );

    this.statusDisplay.update('distance', `${distance.toFixed(1)}m`);
    
    this.emit('location-update', { position, distance, inside });
  }

  onOrientationUpdate(orientation) {
    // Actualitza UI
    this.statusDisplay.update('orientation', `${Math.round(orientation.alpha)}°`);
    this.statusDisplay.update('cardinal', orientation.cardinal);

    // Verifica si apunta cap al target
    const isPointingToTarget = this.checkOrientation(orientation.alpha);

    this.emit('orientation-update', { 
      orientation, 
      isPointingToTarget 
    });
  }

  checkOrientation(currentAngle) {
    // Verifica si l'usuari apunta cap al target (±15°)
    const tolerance = 15;
    let diff = Math.abs(currentAngle - this.targetOrientation);
    
    if (diff > 180) {
      diff = 360 - diff;
    }

    return diff <= tolerance;
  }

  start() {
    super.start();
  }

  stop() {
    super.stop();
    this.locationTracker.stop();
    this.orientationTracker.stop();
  }

  destroy() {
    super.destroy();
    this.locationTracker.stop();
    this.orientationTracker.stop();
    this.statusDisplay.destroy();
  }
}
