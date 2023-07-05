const Sendmail = require("./sendmail.model");
const Joi = require("joi");

//joi validation..
const OtpSchema = Joi.object({
    mail: Joi.string().email().required(),
    otp:Joi.string().required()
}).options({ abortEarly: false });

const WelcomeSchema = Joi.object({
  mail: Joi.string().email().required(),
  password:Joi.string().required(),
  name:Joi.string().required()
}).options({ abortEarly: false });

const FindAccountSchema = Joi.object({
  mail: Joi.string().email().required(),
  password:Joi.string().required(),
  name:Joi.string()
}).options({ abortEarly: false });

// otp mail
exports.otp = function (req, res) {
  console.log(req.body);
  const { error, value } = OtpSchema.validate(req.body);

  if (error === undefined) {
    Sendmail.otp(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while sending otp.",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "otp send successfully",
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while sending otp.",
    });
  }
};

// welcome mail 
exports.welcome = function (req, res) {
  console.log(req.body);
  const { error, value } = WelcomeSchema.validate(req.body);

  if (error === undefined) {
    Sendmail.welcome(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while sending Account Details Message.",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "Account Details Message Successfully",
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while Account Details Message.",
    });
  }
};



// Find account mail 
exports.FindAccount = function (req, res) {
  console.log(req.body);
  const { error, value } = FindAccountSchema.validate(req.body);

  if (error === undefined) {
    Sendmail.FindAccount(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while sending Account Details Message.",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "Account Details Message Successfully",
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while Account Details Message.",
    });
  }
};
