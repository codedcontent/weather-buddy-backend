const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Authorization token is incorrect.");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(401).send("Authorization token is incorrect.");

    // Access token is valid, authenticate user.
    req.user_id = payload.user_id;
    next();
  });
};

module.exports = authenticateToken;
