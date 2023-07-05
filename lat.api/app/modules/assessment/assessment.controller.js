const Assessment = require("./assessment.model");
const Joi = require("joi");

//joi validation..
const Schema = Joi.object({
  student_email: Joi.string().email().required(),
	question_id: Joi.number().integer().required(),
	time_to_complete: Joi.string().required()
}).options({ abortEarly: false });

// create_new_account_user plan..
exports.submit = function (req, res) {
  console.log(req.body);
  const { error, value } = Schema.validate(req.body);

  if (error === undefined) {
    Assessment.submit(req.body, (error, value) => {
      if (error) {
        res.status(500).send({
          status: false,
          alert: "Failed..!",
          message:
            error || "Some error occurred while creating the  Assessment.",
        });
      } else
        res.send({
          status: true,
          alert: "",
          message: " Assessment  submit successfully",
          result:value
        });
    });
  } else {
    res.status(500).send({
      status: false,
      alert: "Failed..!",
      message:
        error.message || "Some error occurred while creating the  Student programs.",
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
		const userDetails = await Assessment.getAll(Q, page,limit);
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
      message: error || "Some error occurred while listing the  Studunt programs." 
    });
  }
};


// get single plan detail
exports.findById = function (req, res) {
	console.log("findById by controller");
	console.log(req.params.id);
  Assessment.findById(req.params.id, (error, value) => {
    if (error) {
      res.status(500).send({
		  status: false, 
		  alert: "Failed..!",
		  message: error || "Some error occurred in  Student program."
      });
    } else
      res.send({
		  status: true,
		  alert: "",
		  message: "Student program details get successfully",
		  data: value
		  });
  });
};


// get data with Student
exports.findBySEmail = function (req, res) {
	console.log("findBySId by controller");
	console.log(req.params.email);
  const status = req.query.assessment_status;
  Assessment.findBySEmail(req.params.email,status, (error, value) => {
    if (error) {
      res.status(500).send({
		  status: false, 
		  alert: "Failed..!",
		  message: error || "Some error occurred in  Student program."
      });
    } else
      res.send({
		  status: true,
		  alert: "",
		  message: "Student program details get successfully",
		  data: value
		  });
  });
};


// get data with Question
exports.findByQId = function (req, res) {
	console.log("findByQId by controller");
	console.log(req.params.id);
  Assessment.findById(req.params.id, (error, value) => {
    if (error) {
      res.status(500).send({
		  status: false, 
		  alert: "Failed..!",
		  message: error || "Some error occurred in  Student program."
      });
    } else
      res.send({
		  status: true,
		  alert: "",
		  message: "Student program details get successfully",
		  data: value
		  });
  });
};

