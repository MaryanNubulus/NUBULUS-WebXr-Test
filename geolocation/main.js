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
