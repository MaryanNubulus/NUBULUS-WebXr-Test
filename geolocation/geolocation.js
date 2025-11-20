// geolocation.js
let userLat = null;
let userLon = null;
let targetPoint = null;
let targetRadius = null;
let statusDiv = null;
let arrowElem = null;

let intervalId = null;

export function setTargetPoint(point, radius, statusElement, arrowElement) {
  targetPoint = point;
  targetRadius = radius;
  statusDiv = statusElement;
  arrowElem = arrowElement;
}

export function initGeolocation(onUpdate) {
  if (!navigator.geolocation) {
    statusDiv.textContent = "Geolocalització no suportada.";
    return;
  }

  function updatePosition() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat = pos.coords.latitude;
        userLon = pos.coords.longitude;
        calcularDistancia(onUpdate);
      },
      (err) => {
        statusDiv.textContent =
          err.code === 1 ? "Permís ubicació denegat." : "Error ubicació.";
      },
      { enableHighAccuracy: true }
    );
  }

  updatePosition();
  intervalId = setInterval(updatePosition, 1000);
}

function calcularDistancia(onUpdate) {
  if (userLat === null) return;

  const from = turf.point([userLon, userLat]);
  const to = turf.point(targetPoint);

  const dist = turf.distance(from, to, { units: "meters" });
  const bearing = turf.bearing(from, to);

  const dins = dist <= targetRadius;

  if (dins) {
    statusDiv.textContent = "✔️ Dins de la zona";
    arrowElem.style.display = "none";
  } else {
    statusDiv.textContent = `${dist.toFixed(1)} m`;
    arrowElem.style.display = "block";
    arrowElem.dataset.bearing = bearing;
  }

  if (onUpdate) onUpdate();
}
