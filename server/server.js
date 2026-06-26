const express = require("express");
const cors = require("cors");
const stations = require("./data/stations.json");
const trains = require("./data/trains.json");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

function toRadians(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}


app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is working" });
});

app.post("/api/nearby-stations", (req, res) => {
  const { lat, lng, radius } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: "lat and lng are required"
    });
  }

  const maxRadius = radius || 30;

  const nearbyStations = stations
    .map((station) => {
      const distance = getDistanceKm(lat, lng, station.lat, station.lng);
      return {
        ...station,
        distance: Number(distance.toFixed(2))
      };
    })
    .filter((station) => station.distance <= maxRadius)
    .sort((a, b) => a.distance - b.distance);

  res.json({
    success: true,
    count: nearbyStations.length,
    stations: nearbyStations
  });
});

app.get("/api/trains", (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message: "from and to station codes are required"
    });
  }

  const matchingTrains = trains.filter(
    (train) =>
      train.from.toUpperCase() === from.toUpperCase() &&
      train.to.toUpperCase() === to.toUpperCase()
  );

  res.json({
    success: true,
    count: matchingTrains.length,
    trains: matchingTrains
  });
});

app.post("/api/best-route", (req, res) => {
  const { sourceLat, sourceLng, destLat, destLng, radius } = req.body;

  if (
    sourceLat === undefined ||
    sourceLng === undefined ||
    destLat === undefined ||
    destLng === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "sourceLat, sourceLng, destLat and destLng are required"
    });
  }

  const maxRadius = radius || 30;

  const sourceStations = stations
    .map((station) => {
      const distance = getDistanceKm(sourceLat, sourceLng, station.lat, station.lng);
      return {
        ...station,
        distance: Number(distance.toFixed(2))
      };
    })
    .filter((station) => station.distance <= maxRadius);

  const destStations = stations
    .map((station) => {
      const distance = getDistanceKm(destLat, destLng, station.lat, station.lng);
      return {
        ...station,
        distance: Number(distance.toFixed(2))
      };
    })
    .filter((station) => station.distance <= maxRadius);

  const routeOptions = [];

  sourceStations.forEach((sourceStation) => {
    destStations.forEach((destStation) => {
      const matchingTrains = trains.filter(
        (train) =>
          train.from.toUpperCase() === sourceStation.code.toUpperCase() &&
          train.to.toUpperCase() === destStation.code.toUpperCase()
      );

      matchingTrains.forEach((train) => {
        const sourceRoadMinutes = Math.round(sourceStation.distance * 2);
        const destRoadMinutes = Math.round(destStation.distance * 2);

        const trainDurationParts = train.duration.split(":");
const trainMinutes =
  parseInt(trainDurationParts[0]) * 60 + parseInt(trainDurationParts[1]);

const totalTravelMinutes = sourceRoadMinutes + trainMinutes + destRoadMinutes;

routeOptions.push({
  sourceStation: sourceStation.name,
  sourceCode: sourceStation.code,
  destinationStation: destStation.name,
  destinationCode: destStation.code,
  trainNumber: train.trainNumber,
  trainName: train.trainName,
  departureTime: train.departureTime,
  arrivalTime: train.arrivalTime,
  duration: train.duration,
  sourceRoadMinutes,
  destRoadMinutes,
  trainMinutes,
  totalTravelMinutes
});
      });
    });
  });

  routeOptions.sort((a, b) => a.totalTravelMinutes - b.totalTravelMinutes);

  res.json({
    success: true,
    sourceStations,
    destStations,
    routeCount: routeOptions.length,
    routes: routeOptions
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});