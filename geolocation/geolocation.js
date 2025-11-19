// geolocation.js
let userLat = null;
let userLon = null;
let targetPoint = null;
let targetRadius = null;
let infoDiv = null;
let arrowElem = null;
let intervalId = null;

export function setTargetPoint(point, radius, infoElement, arrowElement) {
  targetPoint = point;
  targetRadius = radius;
  infoDiv = infoElement;
  arrowElem = arrowElement;
}

export function initGeolocation(onUpdate) {
  if (!navigator.geolocation) {
    infoDiv.textContent = "❌ El teu navegador no suporta geolocalització.";
    return;
  }

  // Funció que obté la posició i calcula distància
  function updatePosition() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat = pos.coords.latitude;
        userLon = pos.coords.longitude;
        calcularDistancia(onUpdate);
      },
      (err) => {
        if (err.code === 1) {
          infoDiv.textContent =
            "❌ Permís denegat. Permet l'accés a la ubicació i recarrega la pàgina.";
        } else {
          infoDiv.textContent = `❌ Error al obtenir la ubicació: ${err.message}`;
        }
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  }

  // Comprovació inicial immediata
  updatePosition();

  // Comprova la posició cada segon
  intervalId = setInterval(updatePosition, 1000);
}

// Opcional: funció per aturar el refresc
export function stopGeolocation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function calcularDistancia(onUpdate) {
  if (userLat === null || userLon === null) return;

  const from = turf.point([userLon, userLat]);
  const to = turf.point(targetPoint);
  const dist = turf.distance(from, to, { units: "meters" });
  const dir = turf.bearing(from, to);

  const dins = dist <= targetRadius ? "✅ Dins del radi" : "📍 Fora del radi";

  infoDiv.textContent =
    `Latitud: ${userLat.toFixed(6)}\n` +
    `Longitud: ${userLon.toFixed(6)}\n` +
    `Distància al punt: ${dist.toFixed(1)} m\n` +
    dins +
    `\nDirecció: ${dir.toFixed(0)}°`;

  // Guardem la direcció en l'element fletxa
  arrowElem.dataset.bearing = dir;

  if (onUpdate) onUpdate();
}
