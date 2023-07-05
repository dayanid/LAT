function StudentsRoutes(app) {

  const Students = require("./students.controller");

  // Endpoint to add a new student
  app.post("/addStudent", Students.create);
  
  // Endpoint to change password
  app.post("/StudentChangePassword", Students.changepassword);


  // Endpoint to get a list of all students
  app.get("/listStudents", Students.getAll);

  // Endpoint to get a student by ID
  app.get("/getStudentById/:id", Students.findById);

  // Endpoint to get a student Login Details by Email
  app.get("/getStudentLoginDetailsByEmail/:email", Students.LoginDetailsByEmail);

  // Endpoint to get a student Login Details 
  app.get("/getStudentLoginDetails", Students.LoginDetails);

  // Endpoint to get a student by email
  app.get("/getStudentByEmail/:email", Students.findByEmail);

  // Endpoint to update a student by id
  app.put("/updateStudentById/:id", Students.updateById);

  // Endpoint to delete a student by email
  app.delete("/deleteStudentByEmail/:email", Students.remove);
}

module.exports = StudentsRoutes;
