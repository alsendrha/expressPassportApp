const mailer = require("nodemailer");
const welcome = require("./welcome_template");
const goodbye = require("./goodbye_template");

let getEmailData = (to, name, template) => {
  let data = null;

  switch (template) {
    case "welcome":
      data = {
        from: "alsendrha@naver.com",
        to,
        subject: `Hello ${name}`,
        html: welcome(),
      };
      break;
    case "goodbye":
      data = {
        from: "alsendrha@naver.com",
        to,
        subject: `Goodbye ${name}`,
        html: goodbye(),
      };
      break;
    default:
      data;
  }
  return data;
};

const sendMail = (to, name, type) => {
  const transporter = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: "alsendrha@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mail = getEmailData(to, name, type);

  transporter.sendMail(mail, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log("email sent successfully");
    }

    transporter.close();
  });
};

module.exports = sendMail;
