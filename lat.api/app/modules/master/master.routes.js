function MasterRoutes(app) {

    const Master = require("./master.controller");
  
    // Endpoint to add a new Master
    app.post("/addMaster", Master.create);
  
    // Endpoint to change password
    app.post("/MasterChangePassword", Master.changepassword);

     }
  
  module.exports = MasterRoutes;
  