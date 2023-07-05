const Login = require("./login.model");
const Joi = require("joi");
//joi validation..
const LoginSchema = Joi.object({
    type:Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).options({ abortEarly: false });



const VerifyLoginSchema = Joi.object({
  token: Joi.string().required()
}).options({ abortEarly: false });

const FindUserSchema = Joi.object({
  type:Joi.string().required(),
  email: Joi.string().email().required()
}).options({ abortEarly: false });

// Login function
exports.login = function (req, res) {
  console.log(req.body);
  const { error, value } = LoginSchema.validate(req.body);
  if (error === undefined) {
    Login.login(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while Login",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "Login  successfully",
          token: value
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while Login",
    });
  }
};

exports.verifypasswords = function (req, res) {
  console.log(req.body);
  const { error, value } = LoginSchema.validate(req.body);
  if (error === undefined) {
    Login.verifypasswords(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while Verify password",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "verify password successfully",
          token: value
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while Verify Password",
    });
  }
};

exports.changepassword = function (req, res) {
  console.log(req.body);
  const { error, value } = LoginSchema.validate(req.body);
  if (error === undefined) {
    Login.changepassword(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while Change password",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "Change password successfully",
          token: value
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while Change Password"
    });
  }
};

// Verify Login function
exports.verifylogin = function (req, res) {
  //console.log(req.body);
  const { error, value } = VerifyLoginSchema.validate(req.body);
  if (error === undefined) {
    Login.verifylogin(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while Verifing Login",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "Verifing Login  successfully",
          verify: value
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while Verifing  Login",
    });
  }
};

// checkmail function
exports.checkmail =  (req, res) => {
  const email = req.params.email; // Extract email from request parameters
  console.log("findById by controller");
	console.log(email);
  Login.checkmail(email, (error, value) => {
    if (error) {
      res.status(500).send({
		  status: false, 
		  alert: "Failed..!",
		  message: error || "Some error occurred in data."
      });
    } else
      res.send({
		  status: true,
		  alert: "",
		  message: "Email details get successfully",
		  result: value
		  });
  });
};


// get single plan detail by email
exports.getuser = function (req, res) {
	//console.log("findByEmail by controller");
	//console.log(req.body);
  const { error, value } = FindUserSchema.validate(req.body);
  if (error === undefined) {
  Login.getuser(req.body, (error, value) => {
    if (error) {
      res.status(500).send({
		  status: false, 
		  alert: "Failed..!",
		  message: error || "Some error occurred in  user data."
      });
    } else
      res.send({
		  status: true,
		  alert: "",
		  message: "User details get successfully",
		  data: value
		  });
  });
}
};