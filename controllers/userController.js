const { profileEditValidation } = require("../validation");
const { getFirestore } = require("firebase-admin/firestore");

// Create a new user account
exports.createAccount = async (req, res) => {
  const db = getFirestore();
  const { first_name, last_name, phone, uid } = req.body;

  // Create user account with their detail on db
  const userCollectionRef = db.doc(`users/${uid}`);

  try {
    await userCollectionRef.set({ first_name, last_name, phone });
    res.status(200).json({
      msg: "Account created successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong on the server, try again later.",
      status: false,
      err: error,
    });
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
