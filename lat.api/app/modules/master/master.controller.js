const Master = require("./master.model");
const Joi = require("joi");
//joi validation..
const CreateSchema = Joi.object({
    master_name: Joi.string().required(),
    master_mobile: Joi.string().required(),
    master_password: Joi.string().required(),
    master_position: Joi.string().required(),
    master_department: Joi.string().required(),
	master_email: Joi.string().email().required()
}).options({ abortEarly: false });

const ChangePasswordSchema = Joi.object({
  master_email: Joi.string().email().required(),
  master_oldpassword: Joi.string().required(),
  master_password: Joi.string().required()
}).options({ abortEarly: false });

// create_new_account_user plan..
exports.create = function (req, res) {
  console.log(req.body);
  const { error, value } = CreateSchema.validate(req.body);

  if (error === undefined) {
    Master.create(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while creating the  Master.",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "Add Master successfully",
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while creating the  Master.",
    });
  }
};

// change password function
exports.changepassword = function (req, res) {
  console.log(req.body);
  const { error, value } = ChangePasswordSchema.validate(req.body);
  if (error === undefined) {
    Master.changepassword(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while Change password.",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "Change password successfully",
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while Change password.",
    });
  }
};

