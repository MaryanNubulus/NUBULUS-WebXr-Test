/**
 * Gestiona l'accés a la càmera del dispositiu
 */
export class CameraManager {
  constructor(videoElement) {
    this.videoElement = videoElement;
    this.stream = null;
  }

  /**
   * Activa la càmera del dispositiu
   */
  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      
      this.videoElement.srcObject = this.stream;
      console.log("✅ Càmera activada");
      return true;
    } catch (err) {
      console.error("Error activant la càmera:", err);
      throw err;
    }
  }

  /**
   * Desactiva la càmera del dispositiu
   */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      console.log("📷 Càmera desactivada");
    }
  }
}
