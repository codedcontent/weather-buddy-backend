const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

exports.addTrackingDetails = async (req, res) => {
  const { locations, user_id, tracking_id } = req.body;

  // Ensure user_id is available
  if (!user_id) return res.status(400).send("User id is required.");

};

exports.sendWeatherDetails = async (req, res) => {
  const { location, timesToTrack } = req.body;

  // Make a request to open-weather-api
  const { latitude, longitude } = location;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}`;

  console.log(url);

  try {
    const result = await fetch(url);
    const data = await result.json();

    if (data) {
      res.send({ data });
      console.log({ data });
    }
  } catch (error) {
    res.send({ error });
  }

  //   res.status(200).send({ location, timesToTrack });
};
