module.exports = app => {
    require("./app/modules/student/students.routes")(app);
	require("./app/modules/question/questions.routes")(app);
	require("./app/modules/assessment/assessment.routes")(app);
	require("./app/modules/Sendmail/sendmail.routes")(app);
	require("./app/modules/testcase/testcase.routes")(app);
	require("./app/modules/master/master.routes")(app);
	require("./app/modules/admin/admin.routes")(app);
	require("./app/modules/login/login.routes")(app);
};