const bcrypt = require("bcryptjs");
const pool = require("../config/database");
const {
  loginValidation,
  emailValidation,
  passwordValidation,
  profileEditValidation,
} = require("../validation");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendEmail");
const { object } = require("joi");
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

// Login
exports.login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  // Validate user inputs
  const { error } = loginValidation(req.body);

  // The users inputs are not valid
  if (error) {
    const validationErrorMsg = error.details[0].message;
    const invalidFormItem = error.details[0].path[0];

    return res.status(400).json({ validationErrorMsg, invalidFormItem });
  }

  // User inputs are valid - attempt to login user.
  // Get email and verify password
  pool.query("SELECT * FROM user WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500);

    //   If the length of result is 0, no such user in db
    if (results.length === 0) {
      res.status(401).json({
        status: false,
        msg: "Email or password is incorrect.",
      });
    } else {
      const user = results[0];

      // Confirm the users password with bcrypt
      if (user.password === password) {
        // Password is correct, authenticate with jwt
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const { password, ...userDetails } = user;

        res.status(200).json({
          status: true,
          accessToken,
          refreshToken,
          msg: "Login successful",
          user: userDetails,
        });
      } else {
        res.status(401).json({
          msg: "Email or password is incorrect.",
          status: false,
        });
      }
    }
  });
};

// Forgot password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  // Validate form inputs
  const { error } = emailValidation(req.body);
  if (error) {
    const validationErrorMsg = error.details[0].message;
    const invalidFormItem = error.details[0].path[0];

    return res.status(400).json({ validationErrorMsg, invalidFormItem });
  }

  // Check if the users exist on db
  pool.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500);

      if (results.length === 0)
        return res
          .status(400)
          .send("An account with this email does not exist");

      // Generate reset-password link
      const userId = results[0].id;
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30s",
      });

      // Prepare the users email details
      const userEmail = email;
      const mailSubject = "Weather Buddy password reset";
      const mailTextContent = `Here's the password reset link for your account, expires in 10 minutes.
      \n
      Password reset link - ${process.env.SERVER_URL}/api/auth/reset-password/${token}
      `;
      const mailHtmlContent = `
        <h1 style={{color: "red"}}>
          Here's the password reset link for your account, expires in 10 minutes
        </h1>

        <p>
        Password reset link - ${process.env.SERVER_URL}/api/auth/reset-password/${token}
        </p>
      `;

      const mailInfo = sendMail({
        userEmail,
        mailSubject,
        mailTextContent,
        mailHtmlContent,
      });

      if (mailInfo?.err) {
        return res.status(500).send("Something went wrong, try again later.");
      } else {
        // Send an email notification for password reset to user
        return res.status(200).send({
          status: true,
          msg: "Password reset link sent to your email address. If you didn't receive the email try requesting a password change again.",
          link: `${process.env.SERVER_URL}/api/auth/reset-password/${token}`,
        });
      }
    }
  );
};

// Reset password
exports.resetPassword = (req, res) => {
  const { pwrul, userId = 16 } = req.query;
  const { newPassword } = req.body;

  //
  // TODO: Validate password reset url
  //

  // Validate users password
  const { error } = passwordValidation({ password: newPassword });
  if (error) {
    const validationErrorMsg = error.details[0].message;
    const invalidFormItem = error.details[0].path[0];

    return res.status(400).json({ validationErrorMsg, invalidFormItem });
  }

  // Update password users password in db
  pool.query(
    "UPDATE user SET password = ? WHERE id = ?",
    [newPassword, userId],
    (err, results) => {
      if (err) return res.status(500);

      res.send(results);
    }
  );
};

// Temp store for refresh tokens
let refreshTokens = [];

// Refresh token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json("You are not authenticated");

  // TODO: Check if refresh token in db
  // if (!refreshTokens.includes(refreshToken))
  //   return res.status(403).json("Token invalid");

  // Refresh token is provided and exists on db, verify it with JWT
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(403).json("Token invalid");

    // If token is verified, delete it from db and generate new tokens
    // TODO: Remove old refresh token from DB

    // Generate new tokens
    const newAccessToken = generateAccessToken(payload?.user_id);
    const newRefreshToken = generateRefreshToken(payload?.user_id);

    // TODO: Add new refresh token to DB

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

// Logout user
exports.logOut = (req, res) => {
  const { refreshToken } = req.body;

  // TODO: delete the refresh token from db
  return res.status(200).json("Logged out successfully.");
};
