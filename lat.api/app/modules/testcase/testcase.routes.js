function testCaseRoutes(app){
    // import controller
    const Testcase=require("./testcase.controller")

    // Check test case .
    app.post("/Checktestcase", Testcase.check);


}


module.exports =testCaseRoutes;