const pool = require("../config/database");

exports.upgradePlan = (req, res) => {
  const { subscription_plan, user_id } = req.body;

  console.log({ user_id, subscription_plan });
};

exports.getPlan = (req, res) => {};
