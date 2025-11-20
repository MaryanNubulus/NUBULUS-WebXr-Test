let lastLocation = { lat: null, lon: null };
let lastOrientation = { alpha: 0 };
let lastTilt = { beta: 0, gamma: 0 };

export function startLocationTracking() {
  navigator.geolocation.watchPosition(
    (pos) => {
      lastLocation.lat = pos.coords.latitude;
      lastLocation.lon = pos.coords.longitude;
    },
    () => {},
    { enableHighAccuracy: true }
  );
}

export function getUserLocation() {
  return { ...lastLocation };
}

export function startOrientationTracking() {
  window.addEventListener("deviceorientation", (e) => {
    if (e.webkitCompassHeading) {
      lastOrientation.alpha = e.webkitCompassHeading;
    } else {
      lastOrientation.alpha = e.alpha || 0;
    }
  });
}

export function getUserOrientation() {
  return { ...lastOrientation };
}

export function startTiltTracking() {
  window.addEventListener("deviceorientation", (e) => {
    lastTilt.beta = e.beta || 0;
    lastTilt.gamma = e.gamma || 0;
  });
}

export function getUserTilt() {
  return { ...lastTilt };
}
