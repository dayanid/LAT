function QuestionsRoutes(app){
    // import controller
    const Questions=require("./questions.controller")

    // create a new Question for Questions
    app.post("/addQuestion", Questions.create);
    
    // create a new Multi Question for Questions
    app.post("/addMultiQuestion", Questions.CreateMultiQuestion);

    // list Questions
     app.get("/listQuestions", Questions.getAll);
    
	// get single Question
     app.get("/getQuestion/:id", Questions.findById);

    //update Question
     app.put("/updateQuestion/:id", Questions.update);

    // delete Question
     app.delete("/deleteQuestion/:id", Questions.remove);
}


module.exports =QuestionsRoutes;