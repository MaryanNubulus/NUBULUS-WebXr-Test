// arrow.js
let deviceAlpha = 0;
let arrowElem = null;

export function initArrow(arrowElement) {
  arrowElem = arrowElement;

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
