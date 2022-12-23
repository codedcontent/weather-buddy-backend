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
};

exports.getAccountDetails = (req, res) => {
  const { user_id } = req.params;
};
