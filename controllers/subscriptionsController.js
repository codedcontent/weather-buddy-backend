const pool = require("../config/database");

exports.upgradePlan = (req, res) => {
  const { subscription_plan, user_id } = req.body;

  console.log({ user_id, subscription_plan });

  if (!user_id)
    return res
      .status(401)
      .json({ msg: "User not authorized. Try again later." });

  // Ensure user exist
  pool.query(
    "SELECT user_id FROM user WHERE user_id = ?",
    [user_id],
    (err, userCheckResults) => {
      if (err)
        return res.status(500).json({
          msg: "Error encountered on the server. Try again later.",
          err,
        });

      // Check does not exists, send error
      if (userCheckResults.length === 0 || !userCheckResults)
        return res.status(400).json({
          msg: "Could not find user on db.",
        });

      // User exists, upgrade subscription
      pool.query(
        "UPDATE user SET subscription_plan = ? WHERE user_id = ?",
        [subscription_plan, user_id],
        (err, updateResult) => {
          if (err)
            return res.status(500).json({
              msg: "Error encountered on the server. Try again later.",
              err,
            });

          return res.status(200).json({
            updateResult,
            msg: "Subscription plan changed.",
          });
        }
      );
    }
  );
};

exports.getPlan = (req, res) => {};
