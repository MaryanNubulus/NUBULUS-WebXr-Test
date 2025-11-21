/**
 * VideoTexture - Creació de textures de vídeo Three.js
 * Controls de reproducció i gestió de memòria
 */
export class VideoTexture {
  constructor(videoSrc, options = {}) {
    this.videoSrc = videoSrc;
    this.video = null;
    this.texture = null;
    this.options = {
      loop: true,
      muted: true,
      autoplay: false,
      playsinline: true,
      crossOrigin: 'anonymous',
      ...options,
    };
    this.isLoaded = false;
    this.isPlaying = false;
  }

  /**
   * Carrega el vídeo i crea la textura
   */
  async load() {
    if (this.isLoaded) {
      console.warn('Video already loaded');
      return this.texture;
    }

    return new Promise((resolve, reject) => {
      // Crea l'element video
      this.video = document.createElement('video');
      this.video.src = this.videoSrc;
      this.video.loop = this.options.loop;
      this.video.muted = this.options.muted;
      this.video.playsInline = this.options.playsinline;
      this.video.crossOrigin = this.options.crossOrigin;
      
      // Afegeix atributs necessaris per reproducció automàtica en mòbils
      this.video.setAttribute('playsinline', '');
      this.video.setAttribute('webkit-playsinline', '');

      this.video.addEventListener('loadeddata', () => {
        console.log(`Video loaded: ${this.videoSrc}`);
        
        // Crea la textura Three.js
        this.texture = new THREE.VideoTexture(this.video);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.format = THREE.RGBAFormat;
        
        this.isLoaded = true;
        
        if (this.options.autoplay) {
          this.play();
        }
        
        resolve(this.texture);
      });

      this.video.addEventListener('error', (error) => {
        console.error(`Error loading video: ${this.videoSrc}`, error);
        reject(error);
      });

      // Inicia la càrrega
      this.video.load();
    });
  }

  /**
   * Reprodueix el vídeo
   */
  play() {
    if (!this.video) {
      console.warn('Video not loaded');
      return;
    }

    const playPromise = this.video.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video playing');
          this.isPlaying = true;
        })
        .catch((error) => {
          console.error('Error playing video:', error);
          // Si falla per política d'autoplay, intenta amb muted
          if (error.name === 'NotAllowedError') {
            this.video.muted = true;
            this.video.play().catch(e => console.error('Failed to play muted:', e));
          }
        });
    }
  }

  /**
   * Pausa el vídeo
   */
  pause() {
    if (this.video) {
      this.video.pause();
      this.isPlaying = false;
      console.log('Video paused');
    }
  }

  /**
   * Torna al principi
   */
  reset() {
    if (this.video) {
      this.video.currentTime = 0;
    }
  }

  /**
   * Estableix el volum
   */
  setVolume(volume) {
    if (this.video) {
      this.video.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Activa/desactiva mute
   */
  setMuted(muted) {
    if (this.video) {
      this.video.muted = muted;
    }
  }

  /**
   * Obté la textura Three.js
   */
  getTexture() {
    return this.texture;
  }

  /**
   * Obté l'element video
   */
  getVideoElement() {
    return this.video;
  }

  /**
   * Obté l'aspect ratio del vídeo
   */
  getAspectRatio() {
    if (!this.video) return 16 / 9; // default
    return this.video.videoWidth / this.video.videoHeight;
  }

  /**
   * Disposa de la textura i allibera recursos
   */
  dispose() {
    this.pause();
    
    if (this.texture) {
      this.texture.dispose();
      this.texture = null;
    }
    
    if (this.video) {
      this.video.src = '';
      this.video.load();
      this.video = null;
    }
    
    this.isLoaded = false;
    this.isPlaying = false;
    
    console.log('VideoTexture disposed');
  }
}
