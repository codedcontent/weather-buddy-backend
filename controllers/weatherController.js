const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

exports.addTrackingDetails = async (req, res) => {
  const { user_id } = req.params;

  /**
   * Map through the req.body and get an array of "location" and "times"
   * *The value property has the "location" and "times" data*
   * filter the data to get only items which have a location
   */

  const trackingDetails = req.body.filter((detail) => detail.location);

  // return res.json({ body: req.body, trackingDetails });

  // Tracking details doc
  const trackingDetailsDoc = db.doc(`users/${user_id}/trackingDetails/data`);

  try {
    // Add transaction details
    await trackingDetailsDoc.set({ trackingDetails });

    res
      .status(200)
      .json({ msg: "Tracking detail added successfully", status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Something went wrong, try again later.",
      status: false,
      error,
    });
  }
};

exports.sendWeatherDetails = async (req, res) => {
  const { location, timesToTrack } = req.body;

  // Make a request to open-weather-api
  const { latitude, longitude } = location;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}`;

  try {
    const result = await fetch(url);
    const data = await result.json();

    if (data) {
      res.send({ data });
      console.info({ data });
    }
  } catch (error) {
    res.send({ error });
  }

  //   res.status(200).send({ location, timesToTrack });
};
