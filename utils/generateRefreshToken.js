const jwt = require("jsonwebtoken");

const generateRefreshToken = (payload) => {
  const refreshToken = jwt.sign(
    { user_id: payload?.user_id },
    process.env.REFRESH_TOKEN_SECRET
  );

  return refreshToken;
};

module.exports = generateRefreshToken;
