const { profileEditValidation } = require("../validation");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

// Create a new user account
exports.createAccount = async (req, res) => {
  const { first_name, last_name, phone, uid } = req.body;

  // Create user account with their detail on db
  const userCollectionRef = db.doc(`users/${uid}`);

  try {
    /**
     * Users by default create a free account
     * make the subscription_plan a free account
     */
    await userCollectionRef.set({
      first_name,
      last_name,
      phone,
      subscription_plan: "free",
    });
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

exports.updateDetails = async (req, res) => {
  const { first_name, last_name, phone } = req.body;
  const { user_id } = req.params;

  // Validate the form details first
  const { error } = profileEditValidation({ first_name, last_name, phone });

  if (error) {
    const validationErrorMsg = error.details[0].message;
    const invalidFormItem = error.details[0].path[0];

    return res.status(400).json({ validationErrorMsg, invalidFormItem });
  }

  // A reference to the users account details
  const userAccountRef = db.doc(`users/${user_id}/`);

  try {
    // Update the users details
    await userAccountRef.update({ first_name, last_name, phone });

    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};

exports.getAccountDetails = async (req, res) => {
  const { user_id } = req.params;
  const userDocRef = db.doc(`users/${user_id}`);

  try {
    // Fetch user document data
    const doc = await userDocRef.get();

    const weatherBuddyData = doc.data();

    // Tracking details doc
    const trackingDetailsDoc = db.doc(`users/${user_id}/trackingDetails/data`);

    // Get the details collection
    const trackingDocResp = await trackingDetailsDoc.get();

    const trackingDetails = trackingDocResp.data();

    res.status(200).json({ ...weatherBuddyData, ...trackingDetails });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong, try again later.",
      status: false,
      error,
    });
  }
};

exports.changeSubscriptionPlan = async (req, res) => {
  const { subscription_plan } = req.body;

  console.log(subscription_plan);

  res.status(200).json({ status: true });
};
