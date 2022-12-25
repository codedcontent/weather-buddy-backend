const { initializeApp, cert } = require("firebase-admin/app");

const serviceAccount = require("../secrets/weather-buddy-9e34b-firebase-adminsdk-c2c3x-a70c2a3922.json");

initializeApp({
  credential: cert(serviceAccount),
});
