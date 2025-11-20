import { CurrentDeviceInfo } from "./currentDeviceInfo.js";
import { CurrentExperienceInfo } from "./currentExperienceInfo.js";
import { ComparisonUtils } from "./comparisonUtils.js";

const device = new CurrentDeviceInfo();
const exp = new CurrentExperienceInfo();

const uLat = document.getElementById("u-lat");
const uLon = document.getElementById("u-lon");
const uOrient = document.getElementById("u-orient");
const uMode = document.getElementById("u-mode");
const uBeta = document.getElementById("u-beta");
const uGamma = document.getElementById("u-gamma");

const cGeo = document.getElementById("c-geo");
const cOrient = document.getElementById("c-orient");
const cTilt = document.getElementById("c-tilt");

function updateUI() {
  uLat.textContent = device.location.lat;
  uLon.textContent = device.location.lon;
  uOrient.textContent = `${device.orientation.degrees}° ${device.orientation.cardinal}`;
  uMode.textContent = device.screen.mode;
  uBeta.textContent = device.tilt.beta;
  uGamma.textContent = device.tilt.gamma;

  const geoRes = ComparisonUtils.isInsideGeofence(
    device.location,
    exp.geofence
  );
  cGeo.textContent = geoRes.inside
    ? "Dins geovalla"
    : `Fora, ${geoRes.meters.toFixed(1)} m`;

  if (geoRes.inside) {
    const orientRes = ComparisonUtils.compareOrientation(
      device.orientation.degrees,
      exp.orientation.degrees
    );
    cOrient.textContent = orientRes;

    if (orientRes === "ok") {
      cTilt.textContent = ComparisonUtils.compareTilt(
        device,
        device.screen.mode
      );
    } else {
      cTilt.textContent = "Esperant orientació correcta";
    }
  } else {
    cOrient.textContent = "Fora geovalla";
    cTilt.textContent = "Fora geovalla";
  }
}

document.getElementById("startBtn").addEventListener("click", async () => {
  await device.requestPermissions();
  device.init();
  setInterval(updateUI, 1000);
});
