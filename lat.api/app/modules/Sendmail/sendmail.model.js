const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL, 
      pass: process.env.MAILPASSWORD 
    }
  });

const Sendmail = function (orgType) {};

//Sendotp function..
Sendmail.otp = (newMail, result) => {

    const sendOTPViaEmail = async (email) => {
        const otp = newMail.otp; 
      
        const mailOptions = {
          from: process.env.MAIL, 
          to: email,
          subject: 'One-Time Password (OTP)',
          html: `<!DOCTYPE html>
      <html>
      <head>
        <title>One-Time Password (OTP)</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
          }
          .container {
            margin: 0 auto;
            max-width: 600px;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            margin-top: 0;
            margin-bottom: 30px;
            text-align: center;
          }
          p {
            color: #666;
            margin-bottom: 15px;
          }
          strong {
            color: #000;
          }
          .otp-container {
            text-align: center;
            padding: 20px;
            background-color: #e6e6e6;
            border-radius: 5px;
            margin-bottom: 30px;
          }
          .otp-text {
            font-size: 36px;
            color: #333;
            margin: 0;
          }
          .instructions {
            font-size: 14px;
            color: #777;
          }
          .thank-you {
            text-align: center;
          }
          .logo {
            text-align: center;
            margin-top: 30px;
          }
          .logo img {
            max-width: 150px;
          }
        </style>
      </head>
      <body>
        <div class="container">
         
          <div class="otp-container">
            <h1>One-Time Password</h1>
            <p class="otp-text"><strong>${otp}</strong></p>
            <p class="instructions">Please use this OTP to complete your verification process.</p>
          </div>
          <p class="thank-you">Thank you!</p>
          <div class="logo">
          <img src="https://innak-crew.github.io/LAT-logo.png" alt="Logo" >
        </div>
          </body>
      </html>
      
      
      ` // Body of the email with HTML template
        };
      
        try {
          // Send the email
          await transporter.sendMail(mailOptions);
          console.log('OTP sent successfully via email');
          result(null,'OTP sent successfully via email');
        } catch (error) {
          console.error('Error sending OTP via email', error);
          result('Error sending OTP via email ',null);
        }
      };
      
      // Usage: Call the sendOTPViaEmail function with the receiver's email address as an argument
sendOTPViaEmail(newMail.mail); // Replace with the receiver's email
      
 


};

//Welcome message  function..
Sendmail.welcome = (newMail, result) => {

  const sendWelcomeViaEmail = async (email) => { 
    
      const mailOptions = {
        from: process.env.MAIL, 
        to: email,
        subject: 'Welcome',
        html: `<!DOCTYPE html>
        <html>
        <head>
            <title>LAT Portal - Welcome</title>
            <link rel="icon" type="image/x-icon" href="https://innak-crew.github.io/LAT-logo.png">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap">
            <style>
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 5px;
                text-align: center;
                background-image: url(https://innak-crew.github.io/back_lat_portal.jpg);
                background-size: cover ;
                color: #eafcf1;
                font-family: 'cosmic sans' , sans-serif ;
            }
        
            .logo img {
                width: 130px;
                margin-top: 20px;
            }
        
            .thank-you {
                font-size: 18px;
                margin-top: 20px;
                color: #ffffff;
                
            }
            .login-button button {
                margin-top: 15px;
                display: inline-block;
                padding: 12px 24px;
                background-color: rgb(80, 80, 219); /* Update the background color to your desired color */
                color: #ffffff;
                font-weight: 900;
                font-size: 18px;
                border-radius: 10px;
                text-decoration: none;
                transition: color 0.3s ease-in-out; /* Add transition effect for smooth hover effect */
            }
        
            .login-button button:hover {
                color: #00ff40; /* Update the color to your desired hover color */
            }
                   
            .user-welcome {
                color: #00ff00;
            }
            .text {
                background: linear-gradient(rgb(#6190E8), rgb(#A7BFE8)) ;
        
            }
        
            .user-info {
                margin-top: 30px;
                text-align: left;
               
            }
        
            .user-info p {
                font-size: 18px;
                margin-bottom: 5px;
                color: #ffffff;
            }
        
            .instructions {
                font-size: 16px;
                margin-top: 20px;
            }
            </style>
        </head>
        <body>
        
            <div class="container">
                <h1 class="text">Welcome to LAT Portal 🖥 <strong>${newMail.name},</strong></h1>
                <div class="user-welcome">
                    <code> <h3><b>Hello World!</b>" A simple but powerful greeting in the world of coding."</h3></code>      
                </div>
                <div class="user-info">
                    <h4>Username: <strong>${newMail.mail}</strong></h4>
                    <h4>Password: <strong>${newMail.password}</strong></h4>
                </div>
                <div class="login-button">
                    <button class="login-button ">Login Now</button>
                </div>
                <div class="logo">
                    <img src="https://innak-crew.github.io/LAT-logo.png" alt="Logo">
                </div>
            </div>
            </body>
            </html>
        
    ` // Body of the email with HTML template
      };
      try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Welcome message successfully via email');
        result(null,'Welcome message successfully via email');
      } catch (error) {
        console.error('Error sending welcome message via email', error);
        result('Error sending welcome message via email ',null);
      }
    };
    
    // Usage: Call the sendOTPViaEmail function with the receiver's email address as an argument
    sendWelcomeViaEmail(newMail.mail); // Replace with the receiver's email
};



//FindAccount message  function..
Sendmail.FindAccount = (newMail, result) => {

  const sendFindAccountViaEmail = async (email) => { 
    
      const mailOptions = {
        from: process.env.MAIL, 
        to: email,
        subject: 'Find Account',
        html: `<!DOCTYPE html>
        <html>
        <head>
            <title>LAT Portal - Welcome</title>
            <style>
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 5px;
                text-align: center;
                background-image: url(https://innak-crew.github.io/back.jpg);
                background-size: cover;
                color: #40ff00;
            }
    
            .logo img {
                width: 100px;
                margin-top: 20px;
            }
    
            .thank-you {
                font-size: 18px;
                margin-top: 20px;
                color: #40ff00;
                
            }
            .login-button button {
                margin-top: 15px;
    display: inline-block;
    padding: 12px 24px;
    background-color: blue; /* Update the background color to your desired color */
    color: #40ff00;
    font-weight: 900;
    font-size: 12px;
    border-radius: 10px;
    text-decoration: none;
    transition: color 0.3s ease-in-out; /* Add transition effect for smooth hover effect */
}

.login-button button:hover {
    color: #8000ff; /* Update the color to your desired hover color */
}
           
            .user-welcome, .text {
                color: #40ff00;
            }
    
            .user-info {
                margin-top: 30px;
                text-align: left;
            }
    
            .user-info p {
                font-size: 18px;
                margin-bottom: 5px;
                color: #40ff00;
            }
    
            .instructions {
                font-size: 16px;
                margin-top: 20px;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <h1 class="text">Hello User</h1>
            <div class="user-welcome">
                <h3>LAT Portal! <br>  This is your LAT login details</h3>
               
            </div>
            <div class="user-info">
                <p>Username: <strong>${newMail.mail}</strong></p>
                <p>Password: <strong>${newMail.password}</strong></p>
            </div>
            <div class="login-button">
                <button class="login-button ">Login Now</button>
            </div>
            <p class="thank-you">Thank you for joining us!</p>
            <div class="logo">
                <img src="https://innak-crew.github.io/LAT-logo.png" alt="Logo">
            </div>
        </div>
        </body>
        </html>
        
        
    ` // Body of the email with HTML template
      };
      try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Find Account Details messaage successfully via email');
        result(null,'Find Account Details messaage successfully via email');
      } catch (error) {
        console.error('Error sending Account details message via email', error);
        result('Error sending Account details message via email ',null);
      }
    };
    
    // Usage: Call the sendOTPViaEmail function with the receiver's email address as an argument
    sendFindAccountViaEmail(newMail.mail); // Replace with the receiver's email
};


module.exports = Sendmail;