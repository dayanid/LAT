function LoginRoutes(app) {

    const Login = require("./login.controller");
  
    // Endpoint to login 
    app.post("/Login", Login.login);
    
      
  // Endpoint to change password
  app.post("/verifypassword", Login.verifypasswords);

    // Endpoint to verifylogin 
    app.post("/VerifyLogin", Login.verifylogin);

    // Endpoint to verifylogin 
    app.post("/changepassword", Login.changepassword);

     // Endpoint to check if an email is already registered
    app.get("/checkmail/:email",  Login.checkmail);

    // Endpoint to get a User by email
    app.post("/getUser", Login.getuser);


   }
  
  module.exports = LoginRoutes;
  