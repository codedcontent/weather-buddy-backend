const pool = require("../config/database");
const { sendMail } = require("../utils/sendEmail");

const tenAmCronJob = () => {
  // Query string to get the contact/tracking details of user with 5:00 AM alter times
  const queryString = `
    SELECT user.first_name, user.last_name, user.email, user.phone, location_to_track.latitude, location_to_track.longitude from user 
    JOIN location_to_track
    ON user.tracking_id IN (
      SELECT location_to_track.tracking_id from location_to_track WHERE location_to_track.location_id IN (
          SELECT time_to_track.location_id FROM time_to_track WHERE time_to_track.time = '10:00 am'
      )
  )
  `;

  // Fetch the users who have opted for weather updates at 5:00 AM
  pool.query(queryString, (err, results) => {
    if (err) {
      // Handle error/ return process
    }

    if (!results || results.length === 0) {
      // There are no users with this tracking time
      return;
    }

    // Loop through the results and send an email to the users
    results.forEach(
      ({
        first_name,
        last_name,
        email,
        phone,
        location_name,
        latitude,
        longitude,
        subscription_plan,
      }) => {
        // Depending on the users subscription type, send an alert through email or through their phone numbers.
        if (subscription_plan === "free") {
          const reverseGeoCodedLocation = "some-locashe";

          // Form the users update details
          const weatherUpdateTextContent = `
        Hey ${first_name}, here is your weather update for ${reverseGeoCodedLocation}.

        \n
        The weather is Sunny - 20℃. - You should wear light clothes because of the heat.
        `;

          const weatherHTMLContent = `
            <html>
                <body>
                    <h3 style={{color: 'red'}}>
                        Hey ${first_name}, here is your weather update for ${reverseGeoCodedLocation}.
                    </h3>

                    <p style={{color: 'red', fontStyle: 'italics'}}>
                        The weather is Sunny - 20℃. - You should wear light clothes because of the heat. 
                    </p>
                </body>
            </html>
        `;

          // console.log(results);
          const mailStatus = sendMail({
            userEmail: "ogescoc@gmail.com",
            mailSubject: "Weather Buddy weather update",
            mailTextContent: weatherUpdateTextContent,
            mailHtmlContent: weatherHTMLContent,
          });

          if (mailStatus?.err) {
            // Handle error
            console.log(err);
          }
        } else {
          // XXX: Send update via phone num - via twilio
        }
      }
    );
  });
};

module.exports = tenAmCronJob;
