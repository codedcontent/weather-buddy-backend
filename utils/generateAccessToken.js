const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
  const accessToken = jwt.sign(
    { user_id: payload?.user_id },
    process.env.ACCESS_TOKEN_SECRET,
    // { expiresIn: "10m" }
    { expiresIn: "15s" }
  );

  return accessToken;
};

module.exports = generateAccessToken;
