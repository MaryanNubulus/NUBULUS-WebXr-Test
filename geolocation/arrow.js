// arrow.js
let deviceAlpha = 0;
let arrowElem = null;

export function initArrow(elem) {
  arrowElem = elem;

  // iOS Safari — cal demanar permís
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission().then((res) => {
      if (res === "granted") {
        window.addEventListener("deviceorientation", handleOrientation);
      } else {
        alert("Permís sensors denegat.");
      }
    });
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

function handleOrientation(event) {
  if (event.webkitCompassHeading) {
    deviceAlpha = event.webkitCompassHeading; // iPhone
  } else {
    deviceAlpha = event.alpha || 0; // Android / PC
  }
  updateArrow();
}

export function updateArrow() {
  if (!arrowElem || !arrowElem.dataset.bearing) return;

  const targetBearing = parseFloat(arrowElem.dataset.bearing);
  const angle = targetBearing - deviceAlpha;

  arrowElem.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}
