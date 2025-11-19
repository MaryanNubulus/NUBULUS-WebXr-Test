// arrow.js
let deviceAlpha = 0;
let arrowElem = null;

export function initArrow(arrowElement) {
  arrowElem = arrowElement;

  requestDeviceOrientationPermission();

  window.addEventListener("deviceorientation", (e) => {
    deviceAlpha = e.alpha || 0;
    updateArrow();
  });
}

export function updateArrow() {
  if (!arrowElem || !arrowElem.dataset.bearing) return;

  const dir = parseFloat(arrowElem.dataset.bearing);
  const angle = dir - deviceAlpha; // compensació orientació
  arrowElem.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

function requestDeviceOrientationPermission() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          alert("❌ Permís de sensors denegat. La fletxa no es mostrarà.");
        }
      })
      .catch(console.error);
  } else {
    // Altres navegadors, directament escoltem el sensor
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

function handleOrientation(event) {
  deviceAlpha = event.alpha || 0;
  updateArrow();
}
