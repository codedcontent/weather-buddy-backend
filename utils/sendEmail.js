const nodemailer = require("nodemailer");

exports.sendMail = ({
  userEmail,
  mailSubject,
  mailTextContent,
  mailHtmlContent,
}) => {
  const transporterOptions = {
    service: "gmail",
    auth: {
      user: "ogemephors002@gmail.com",
      pass: "cndwlhjzgocdlbqv",
    },
  };

  let transporter = nodemailer.createTransport(transporterOptions);

  const mailOptions = {
    from: "ogemephors002@gmail.com",
    to: userEmail,
    subject: mailSubject,
    text: mailTextContent,
    html: mailHtmlContent ? mailHtmlContent : null,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    return { err, info };
  });
};
