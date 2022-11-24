const bcrypt = require("bcryptjs");
const pool = require("../config/database");
const { registerValidation, profileEditValidation } = require("../validation");

// Create a new user account
exports.createAccount = async (req, res) => {
  const { first_name, last_name, email, phone, password } = req.body;

  // Validate the users inputs
  const { error } = registerValidation(req.body);
  if (error) {
    const validationErrorMsg = error.details[0].message;
    const invalidFormItem = error.details[0].path[0];

    return res.status(400).json({ validationErrorMsg, invalidFormItem });
  }

  // Check if user already exist on DB
  pool.query(
    "SELECT email FROM user WHERE email = ?",
    [email],
    (err, results) => {
      if (err)
        return res.status(500).send("Something went wrong. Try again later.");

      //   If results length > 0, the user already exist on DB
      if (results.length > 0) {
        res.status(400).send("A user with this email already exist.");
      } else {
        // Create new user
        pool.query(
          "INSERT INTO user (first_name, last_name, email, phone, password) values (?, ?, ?, ?, ?)",
          [first_name, last_name, email, phone, password],
          (err, results) => {
            if (err) return res.status(500);

            res.status(200).json({ id: results.insertId });
          }
        );
      }
    }
  );
};

exports.updateDetails = (req, res) => {
  const { form } = req.body;
  const { user_id } = req.params;

  if (!form) return res.status(403).json("Forbidden. Must send form.");

  // Validate the form details first
  const { error } = profileEditValidation(form);

  if (error) {
    const validationErrorMsg = error.details[0].message;
    const invalidFormItem = error.details[0].path[0];

    return res.status(400).json({ validationErrorMsg, invalidFormItem });
  }

  // Form inputs is valid, proceed with profile edition.
  const keyToUpdate = Object.keys(form);
  const valuesToUpdate = Object.values(form);

  // Verify user exists
  pool.query(
    "SELECT user_id FROM user WHERE user_id = ?",
    [user_id],
    (err, results) => {
      console.log(req.params);
      if (err)
        return res.status(500).json({
          err,
          msg: "Something went wrong on the server, try again later.",
        });

      if (results.length === 0)
        return res
          .status(400)
          .json({ msg: "No such user with the details exists." });

      // The user exists, update their details
      pool.query(
        `UPDATE user SET ${keyToUpdate.join(" = ?, ")} = ? WHERE user_id = ?`,
        [...valuesToUpdate, user_id],
        (err, updateResults) => {
          if (err)
            return res.status(500).json({
              err,
              msg: "Something went wrong on the server, try again later.",
            });

          res.status(200).json({ msg: "Account update successful." });
        }
      );
    }
  );
};

exports.getAccountDetails = (req, res) => {
  const { user_id } = req.params;

  // Search db for user with the provided id
  pool.query(
    "SELECT * FROM user WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return res.status(500);

      if (!results.length)
        return res.status(401).json("User with that id not found");

      const { password, ...userDetails } = results[0];
      return res.status(200).json({ user: userDetails });
    }
  );
};
