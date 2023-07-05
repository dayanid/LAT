function SendmailRoutes(app){
    // import controller
    const Sendmail=require("./sendmail.controller")

    // send otp mail
    app.post("/sentotp", Sendmail.otp);

     // send Welcome mail
     app.post("/welcomemail", Sendmail.welcome);

     // Find Account details mail
     app.post("/findaccount", Sendmail.FindAccount);    

}


module.exports = SendmailRoutes;