const Students = require("./students.model");
const Joi = require("joi");
//joi validation..
const CreateSchema = Joi.object({
    student_name: Joi.string().required(),
    student_mobile: Joi.string().required(),
    student_registerno: Joi.string().required(),
    student_passout: Joi.string().required(),
    student_gender: Joi.string().required(),
    student_graduation: Joi.string().required(),
    student_department: Joi.string().required(),
	  student_email: Joi.string().email().required(),
    student_password: Joi.string().required(),
    student_profile: Joi.string()
}).options({ abortEarly: false });

const UpdateSchema = Joi.object({
  student_name: Joi.string().required(),
  student_mobile: Joi.string().required(),
  student_registerno: Joi.string().required(),
  student_passout: Joi.string().required(),
  student_gender: Joi.string().required(),
  student_graduation: Joi.string().required(),
  student_department: Joi.string().required(),
  student_email: Joi.string().email().required()
}).options({ abortEarly: false });

const ChangePasswordSchema = Joi.object({
  student_email: Joi.string().email().required(),
  student_newPassword: Joi.string().required(),
}).options({ abortEarly: false });

const LoginSchema = Joi.object({
  student_email: Joi.string().email().required(),
  student_password: Joi.string().required()
}).options({ abortEarly: false });

const VerifyLoginSchema = Joi.object({
  token: Joi.string().required()
}).options({ abortEarly: false });


// create_new_account_user plan..
exports.create = function (req, res) {
  console.log(req.body);
  const { error, value } = CreateSchema.validate(req.body);

  if (error === undefined) {
    Students.create(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while creating the  Students.",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "Add Student successfully",
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while creating the  Students.",
    });
  }
};

// change password function
exports.changepassword = function (req, res) {
  console.log(req.body);
  const { error, value } = ChangePasswordSchema.validate(req.body);
  if (error === undefined) {
    Students.changepassword(req.body, (error, value) => {
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

// getAll list
exports.getAll = async function (req, res) {
  try {
    let where = [];
		// Start Limit & Page
		const Q = req.query.q;
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const userDetails = await Students.getAll(Q, page,limit);
    res.send({
      status: true,
       alert: "", 
       message: "list successfully ",
      data: userDetails
    } );
  } catch (error) {
    res.status(500).send({
      status: false ,
      alert: "Failed..!" ,
      message: error || "Some error occurred while listing the  Studunts." 
    });
  }
};

// checkmail function
exports.checkmail =  (req, res) => {
  const email = req.params.email; // Extract email from request parameters
  console.log("findById by controller");
	console.log(email);
  Students.checkmail(email, (error, value) => {
    if (error) {
      res.status(500).send({
		  status: false, 
		  alert: "Failed..!",
		  message: error || "Some error occurred in  Student data."
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


// get single plan detail
exports.findById = function (req, res) {
	console.log("findById by controller");
	console.log(req.params.id);
  Students.findById(req.params.id, (error, value) => {
    if (error) {
      res.status(500).send({
		  status: false, 
		  alert: "Failed..!",
		  message: error || "Some error occurred in  Student data."
      });
    } else
      res.send({
		  status: true,
		  alert: "",
		  message: "Student details get successfully",
		  data: value
		  });
  });
};

// get single User Login detail
exports.LoginDetailsByEmail = function (req, res) {
	console.log(req.params.email);
  Students.LoginDetailsByEmail(req.params.email, (error, value) => {
    if (error) {
      res.status(500).send({
		  status: false, 
		  alert: "Failed..!",
		  message: error || "Some error occurred in  Student Login Details data."
      });
    } else
      res.send({
		  status: true,
		  alert: "",
		  message: "Student login details successfully",
		  data: value
		  });
  });
};

// get All user login plan detail
exports.LoginDetails = function (req, res) {
  Students.LoginDetails( (error, value) => {
    if (error) {
      res.status(500).send({
		  status: false, 
		  alert: "Failed..!",
		  message: error || "Some error occurred in  Student Login Details data."
      });
    } else
      res.send({
		  status: true,
		  alert: "",
		  message: "Students login details successfully",
		  data: value
		  });
  });
};

// get single plan detail by email
exports.findByEmail = function (req, res) {
	console.log("findByEmail by controller");
	console.log(req.params.email);
  Students.findByEmail(req.params.email, (error, value) => {
    if (error) {
      res.status(500).send({
		  status: false, 
		  alert: "Failed..!",
		  message: error || "Some error occurred in  Student data."
      });
    } else
      res.send({
		  status: true,
		  alert: "",
		  message: "Student details get successfully",
		  data: value
		  });
  });
};

// update a plan
exports.updateById = function (req, res) {
  const { error, value } = UpdateSchema.validate(req.body);
  if (error === undefined) {
    console.log(req.body);
  Students.updateById(req.params.id,
    { ...req.body },
    (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while Updating the  Students."
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: "update successfully",
        });
    }
  );
  }else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred updating the  Students.",
    });
  }
};


//  delete a plan
exports.remove = function (req, res) {
  Students.remove(req.params.email, (error, value) => {
    if (error) {
      res.status(500).send({
        status: false,
        alert: "Failed..!",
        message: error || "Some error occurred while deleting Students."
      });
    } else
      res.send({
        status: true,
        alert: "",
        message: "delete successfully",
      });
  });
};