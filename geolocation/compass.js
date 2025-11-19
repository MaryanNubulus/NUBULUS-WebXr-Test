// compass.js
let deviceAlpha = 0;
let arrowElem = null;

export function initCompass(arrowElement) {
  arrowElem = arrowElement;

  window.addEventListener("deviceorientation", (e) => {
    deviceAlpha = e.alpha || 0;
    updateCompass();
  });
}

export function updateCompass() {
  if (!arrowElem || !arrowElem.dataset.bearing) return;

  const dir = parseFloat(arrowElem.dataset.bearing);
  const angle = dir - deviceAlpha; // compensació orientació
  arrowElem.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}
