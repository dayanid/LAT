const Testcase = require("./testcase.model");
const Joi = require("joi");

//joi validation..
const Schema = Joi.object({
  student_email: Joi.string().email().required(),
    question_id: Joi.number().required(),
    question_text: Joi.string().required(),
	  code: Joi.string().required(),
    input:Joi.string().empty(),
    output:Joi.string().required(),
    language:Joi.string().required(),
    compilestatus:Joi.boolean().required(),
    runtime:Joi.number().required(),
}).options({ abortEarly: false });


//check and valid test case function..
exports.check = function (req, res) {
    console.log(req.body);
    const { error, value } = Schema.validate(req.body);
  
    if (error === undefined) {
      Testcase.check(req.body, (error, value) => {
        if (error) {
          res.status(500).send({
            status: false,
            alert: "Failed..!",
            result: error
          });
        } else
          res.send({
            status: true,
            alert: "",
            message: "Testcase checking successfully",
            result: value
          });
      });
    } else {
      res.status(500).send({
        status: false,
        alert: "Failed..!",
        message:
          error.message || "Some error occurred while Testcase checking.",
      });
    }
  };
