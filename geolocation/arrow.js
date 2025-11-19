// arrow.js
let deviceAlpha = 0;
let arrowElem = null;

export function initArrow(arrowElement) {
  arrowElem = arrowElement;

  // Safari iOS: demanar permisos
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
    // Altres navegadors
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

function handleOrientation(event) {
  // iOS Safari utilitza webkitCompassHeading
  if (event.webkitCompassHeading) {
    deviceAlpha = event.webkitCompassHeading; // graus respecte nord real
  } else if (event.absolute === true || event.absolute === undefined) {
    deviceAlpha = event.alpha || 0; // Android / PC
  } else {
    deviceAlpha = event.alpha || 0; // fallback
  }

  updateArrow();
}

export function updateArrow() {
  if (!arrowElem || !arrowElem.dataset.bearing) return;

  const dir = parseFloat(arrowElem.dataset.bearing);
  const angle = dir - deviceAlpha;
  arrowElem.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}
