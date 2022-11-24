const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

exports.addTrackingDetails = async (req, res) => {
  const { locations, user_id, tracking_id } = req.body;

  // Ensure user_id is available
  if (!user_id) return res.status(400).send("User id is required.");

  // Check if user exists
  pool.query(
    "SELECT user_id FROM user WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err)
        return res.status(500).send({
          err,
          msg: "Something went wrong on the server. Try again later.",
        });

      // No such user exist, send error
      if (results.length === 0 || !results)
        return res.status(404).send("This user cant be found on the db");

      // User exists, proceed to add tracking details
      /**
       * The params variable contains the users tracking id, and the locations details for that tracking id
       */
      const params = [];
      /**
       * The timesParams variable contains the location id, and the time details to track for that location
       */
      const timesParams = [];

      const newTrackingId = uuidv4();
      // Loop through the location details and format data for entering into DB
      locations.forEach((location) => {
        const locationId = uuidv4();

        // If user does not have tracking id, create one, else use the supplied tracking_id
        params.push([
          tracking_id ? tracking_id : newTrackingId,
          locationId,
          location.latitude,
          location.longitude,
        ]);

        // Add the location_id and the times details for that location
        timesParams.push({
          locationId,
          timesToTrack: location.timesToTrack,
        });
      });

      // Do some data manipulation to get the desired format to add multiple times to track to the db
      const timesParamsUpdated = timesParams.map((data) => {
        const timesToTrack = data.timesToTrack;

        const mappedData = [];

        // Loop through the times to track and transform it into a list of its location_id, time_id and that particular time
        timesToTrack.forEach((time) => {
          const timeId = uuidv4();
          mappedData.push([data.locationId, timeId, time]);
        });

        return mappedData;
      });
      const timesMappedToLocationId = [].concat(...timesParamsUpdated);

      // Add the times to track to the time_to_track db
      pool.query(
        "INSERT INTO time_to_track VALUES ?;",
        [timesMappedToLocationId],
        (err, resp) => {
          if (err)
            return res.status(500).send({
              err,
              msg: "Something went wrong on the server, try again later",
            });

          // Add the locations to track to location_to_track db
          pool.query(
            `INSERT INTO location_to_track (tracking_id, location_id, latitude, longitude) VALUES ?;`,
            [params],
            (err, trackingLocationsAddResults) => {
              if (err)
                return res.status(500).send({
                  err,
                  msg: "Something went wrong on the server, try again later",
                });

              // Link users tracking_id foreign-key to the location_to_track tracking_id if it does not exists on the user
              if (!tracking_id) {
                pool.query(
                  "UPDATE user SET tracking_id = ? WHERE user_id = ?",
                  [newTrackingId, user_id],
                  (err, linkRes) => {
                    if (err)
                      return res.status(500).send({
                        err,
                        msg: "Something went wrong on the server, try again later.",
                      });

                    return res.status(200).send({
                      linkRes,
                      resp,
                      trackingLocationsAddResults,
                      msg: "Weather details to track added successfully",
                    });
                  }
                );
              }

              return res.status(200).send({
                resp,
                trackingLocationsAddResults,
                msg: "Weather details to track added successfully",
              });
            }
          );
        }
      );
    }
  );
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
