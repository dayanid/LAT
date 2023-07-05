function AdminRoutes(app) {

    const Admin = require("./admin.controller");
  
    // Endpoint to add a new Admin
    app.post("/addAdmin", Admin.create);
 
    // Endpoint to change password
    app.post("/AdminChangePassword", Admin.changepassword);

   }
  
  module.exports = AdminRoutes;
  