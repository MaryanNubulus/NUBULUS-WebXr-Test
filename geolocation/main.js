import {
  startLocationTracking,
  startOrientationTracking,
  startTiltTracking,
  getUserLocation,
  getUserOrientation,
  getUserTilt,
} from "./userInfo.js";

import { requestPermissions } from "./permissions.js";

function startSystem() {
  startLocationTracking();
  startOrientationTracking();
  startTiltTracking();

  const latSpan = document.getElementById("lat");
  const lonSpan = document.getElementById("lon");
  const alphaSpan = document.getElementById("alpha");
  const betaSpan = document.getElementById("beta");
  const gammaSpan = document.getElementById("gamma");

  setInterval(() => {
    const pos = getUserLocation();
    const ori = getUserOrientation();
    const tilt = getUserTilt();

    latSpan.textContent = pos.lat !== null ? pos.lat.toFixed(6) : "---";
    lonSpan.textContent = pos.lon !== null ? pos.lon.toFixed(6) : "---";
    alphaSpan.textContent = ori.alpha.toFixed(0);
    betaSpan.textContent = tilt.beta.toFixed(1);
    gammaSpan.textContent = tilt.gamma.toFixed(1);
  }, 1000);
}

window.onload = async () => {
  const btn = document.getElementById("start");

  btn.addEventListener("click", async () => {
    const allowed = await requestPermissions();
    if (!allowed) return;

    btn.style.display = "none";
    startSystem();
  });
};
