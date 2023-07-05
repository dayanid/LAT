function AssessmentRoutes(app){
    // import controller
    const Assessment=require("./assessment.controller")

    // create a new User for Assessment
    app.post("/AssessmentSubmit", Assessment.submit);

    // list Assessment
     app.get("/listAssessments", Assessment.getAll);
    
	// get  Assessment with id
     app.get("/getAssessmentByID/:id", Assessment.findById);
     
	// get  Assessment with student email
     app.get("/getAssessmentByStudentEmail/:email", Assessment.findBySEmail);
     
	// get  Assessment with queston id
     app.get("/getAssessmentByQuestionID/:id", Assessment.findByQId);
}


module.exports =AssessmentRoutes;