/**
 * AudioManager - Gestió centralitzada d'àudio
 * Càrrega i reproducció de sons amb controls
 */
export class AudioManager {
  constructor() {
    this.context = null;
    this.sounds = new Map();
    this.isMuted = false;
    this.masterVolume = 1.0;
  }

  /**
   * Inicialitza el context d'àudio
   */
  async init() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();
      console.log('AudioManager initialized');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw error;
    }
  }

  /**
   * Carrega un so
   */
  async loadSound(id, path) {
    if (this.sounds.has(id)) {
      console.warn(`Sound ${id} already loaded`);
      return this.sounds.get(id);
    }

    if (!this.context) {
      await this.init();
    }

    try {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

      const sound = {
        id,
        path,
        buffer: audioBuffer,
        source: null,
        gainNode: null,
        isPlaying: false,
        volume: 1.0,
        loop: false
      };

      this.sounds.set(id, sound);
      console.log(`Sound loaded: ${id}`);
      
      return sound;
    } catch (error) {
      console.error(`Error loading sound ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reprodueix un so
   */
  play(id, options = {}) {
    const sound = this.sounds.get(id);
    if (!sound) {
      console.error(`Sound ${id} not found`);
      return;
    }

    // Atura el so si ja s'està reproduint
    if (sound.isPlaying) {
      this.stop(id);
    }

    // Crea source i gain node
    sound.source = this.context.createBufferSource();
    sound.source.buffer = sound.buffer;
    sound.source.loop = options.loop || sound.loop;

    sound.gainNode = this.context.createGain();
    sound.gainNode.gain.value = this.isMuted ? 0 : (options.volume || sound.volume) * this.masterVolume;

    // Connecta nodes
    sound.source.connect(sound.gainNode);
    sound.gainNode.connect(this.context.destination);

    // Callback quan acaba
    sound.source.onended = () => {
      sound.isPlaying = false;
      if (options.onEnded) options.onEnded();
    };

    sound.source.start(0);
    sound.isPlaying = true;

    console.log(`Playing sound: ${id}`);
  }

  /**
   * Atura un so
   */
  stop(id) {
    const sound = this.sounds.get(id);
    if (!sound || !sound.isPlaying) return;

    if (sound.source) {
      sound.source.stop();
      sound.source.disconnect();
      sound.source = null;
    }

    if (sound.gainNode) {
      sound.gainNode.disconnect();
      sound.gainNode = null;
    }

    sound.isPlaying = false;
    console.log(`Stopped sound: ${id}`);
  }

  /**
   * Atura tots els sons
   */
  stopAll() {
    this.sounds.forEach((sound, id) => {
      if (sound.isPlaying) {
        this.stop(id);
      }
    });
  }

  /**
   * Activa mute
   */
  mute() {
    this.isMuted = true;
    this.sounds.forEach(sound => {
      if (sound.gainNode) {
        sound.gainNode.gain.value = 0;
      }
    });
    console.log('Audio muted');
  }

  /**
   * Desactiva mute
   */
  unmute() {
    this.isMuted = false;
    this.sounds.forEach(sound => {
      if (sound.gainNode) {
        sound.gainNode.gain.value = sound.volume * this.masterVolume;
      }
    });
    console.log('Audio unmuted');
  }

  /**
   * Estableix el volum master
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    this.sounds.forEach(sound => {
      if (sound.gainNode && !this.isMuted) {
        sound.gainNode.gain.value = sound.volume * this.masterVolume;
      }
    });
  }

  /**
   * Estableix el volum d'un so específic
   */
  setVolume(id, volume) {
    const sound = this.sounds.get(id);
    if (!sound) return;

    sound.volume = Math.max(0, Math.min(1, volume));
    
    if (sound.gainNode && !this.isMuted) {
      sound.gainNode.gain.value = sound.volume * this.masterVolume;
    }
  }

  /**
   * Neteja tots els sons
   */
  dispose() {
    this.stopAll();
    this.sounds.clear();
    
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    
    console.log('AudioManager disposed');
  }
}
