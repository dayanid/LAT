const Admin = require("./admin.model");
const Joi = require("joi");
//joi validation..
const CreateSchema = Joi.object({
    admin_name: Joi.string().required(),
    admin_mobile: Joi.string().required(),
    admin_password: Joi.string().required(),
    admin_position: Joi.string().required(),
    admin_faculty_id: Joi.string().required(),
    admin_department: Joi.string().required(),
	admin_email: Joi.string().email().required()
}).options({ abortEarly: false });



const ChangePasswordSchema = Joi.object({
  admin_email: Joi.string().email().required(),
  admin_oldpassword: Joi.string().required(),
  admin_password: Joi.string().required()
}).options({ abortEarly: false });


// create_new_account_user plan..
exports.create = function (req, res) {
  console.log(req.body);
  const { error, value } = CreateSchema.validate(req.body);

  if (error === undefined) {
    Admin.create(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while creating the  Admin.",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "Add Admin successfully",
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while creating the  Admin.",
    });
  }
};

// change password function
exports.changepassword = function (req, res) {
  console.log(req.body);
  const { error, value } = ChangePasswordSchema.validate(req.body);
  if (error === undefined) {
    Admin.changepassword(req.body, (error, value) => {
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
