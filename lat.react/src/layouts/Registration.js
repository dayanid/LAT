import React, { useState } from "react";
import "../assets/css/Registration.css";
import NotificationAlert from 'react-notification-alert';
import { generateApiKey } from '../Api/api';
// reactstrap components
import {
  Container,Card,CardHeader,CardBody,  Row,  Col
} from "reactstrap";

const notify = (notificationAlertRef, place, type , message) => {
  if (notificationAlertRef && notificationAlertRef.current) {
    var color = Math.floor(Math.random() * 5 + 1);
    var options = {
      place: place,
      message: (
        <div>
         {message}
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 3
    };
    notificationAlertRef.current.notificationAlert(options);
  } else {
    console.error('notificationAlertRef is not properly defined or initialized');
  }
};

function StudentRegistration() {
  const notificationAlertRef = React.useRef();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const [passoutYear, setPassoutYear] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [mailotp, setmailOtp] = useState(Math.floor(100000 + Math.random() * 900000));
  const [gender, setGender] = useState("");
  const [graduation, setGraduation] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("none");
  const [error, setError] = useState("none");
  const [submit, setSubmit] = useState("");
  const [verify, setVerify] = useState("none");
  const [filePath, setFilePath] = useState('');
  const SetOtp = async () => {
    
    if (name && mobile && registerNo && passoutYear && email && password && repassword && gender && department && graduation && filePath) {
      try {
        notify(notificationAlertRef, "tc","success","Please Wait . . .");
        await SendOtp();
        notify(notificationAlertRef, "tc","success",`OTP has been sent to ${email}. \n check spam also.`);
      } catch (error) {
        console.error(error);
        notify(notificationAlertRef, "tc","danger",`OTP could not be sent ${email}. Some error occurred.`);
      }
    }
     else {
      notify(notificationAlertRef, "tc","danger", "Please fill  all the data. include profile");
    }
  };
  
  const SendOtp = async () => {
    const url = "http://localhost:9000/sentotp";
    const data = {
      mail: email,
      otp: mailotp.toString(),
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: generateApiKey(),
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.alert === "") {
        setVerify("");
        setSubmit("none");
      }
    } catch (error) {
      throw error;
    }
  };
  
  const handleRePassword = () =>{
    if ( password.length >= 8){
      if( password === repassword){
        notify(notificationAlertRef, "tc","success", `Password is matched`);
      }else{
        notify(notificationAlertRef, "tc","danger","Password is not matched");
        setGender("");
      }
    }else{
      notify(notificationAlertRef, "tc","danger", "Password min long is  8");
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file && file.size > maxSize) {
      // File size exceeds the maximum limit
      event.target.value = ""; // Clear the file input
      notify(notificationAlertRef, "tc","danger", "File size exceeds the maximum limit of 5MB.");
      return;
    }else{
      const file = event.target.files[0];
      // Create a new FileReader instance
      const reader = new FileReader();
      // Read the file as data URL
      reader.readAsDataURL(file);
      // Set the file path to state when the file is loaded
      reader.onload = () => {
        setFilePath(reader.result);
        //notify(notificationAlertRef, "tc","success","Now Submit");
      };
    }
  };
  

  const handleSubmit = (event) => {
   if (otp.toString() === mailotp.toString()){
    const formData = {
      student_name: name,
      student_mobile: mobile,
      student_registerno: registerNo,
      student_passout: passoutYear,
      student_email: email,
      student_password: repassword,
      student_gender: gender,
      student_graduation: graduation,
      student_department: department,
      student_profile:filePath
    };
    fetch('http://localhost:9000/addStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': generateApiKey()
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      notify(notificationAlertRef, "tc","success",`${data.message} ${name}. \n Check your Email`);
      window.location.href="/login";
      const apiUrl = 'http://localhost:9000/welcomemail';
  const requestBody = JSON.stringify({
    mail: email,
    name: name,
    password: repassword
  });

  // Make POST request to create welcome mail
  fetch(apiUrl, {
    method: 'POST',
    body: requestBody,
    headers: {
      'Content-Type': 'application/json',
      'apikey': generateApiKey()
    }
  })
    .then(response => {
      // Check if response is successful
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to create welcome mail");
      }
    })
    .then(data => {
      // Handle data from response
      console.log("Welcome mail created successfully:", data);
    })
    .catch(error => {
      // Handle fetch error
      console.error("Failed to create welcome mail", error);
    });

    })
    .catch(error => {
      console.error(error);
    notify(notificationAlertRef, "tc","danger", "Failed to add Student!");
    });
   }else{
    notify(notificationAlertRef, "tc","danger","OTP is Incorrect");
   }
    // Perform validation and other operations as needed
  };

  const chechmail = () => {

    if (email === ""){
      notify(notificationAlertRef, "tc","danger", "First Enter your Email");
    }else{
      if(email.endsWith("@gmail.com")){
        const headers = {
          apikey: generateApiKey()
        };
      
        // Make API request to check if email exists
        fetch(`http://localhost:9000/checkmail/${email}`, {
          headers: headers
        })
          .then(response => {
            // Check if response is successful
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Failed to verify email");
            }
          })
          .then(data => {
            // Handle data from response
            if (data.status && data.result && data.result.found) {
              setEmail("");
              notify(notificationAlertRef, "tc","danger", `${email} is already exists`);
            } else {
              console.log("Email does not exist");
            }
          })
          .catch(error => {
            // Handle fetch error
            console.error("Failed to verify email", error);
          });
        
      }else{
        notify(notificationAlertRef, "tc","danger", "Enter valid mail @gmail.com");
      }
    }

  }

  return (
    <>
    <div>
        <NotificationAlert ref={notificationAlertRef} />
    </div>   
    <div className="sign" > 
      
        <Card className="regbox">

          <Row>
          <Col md="12">
          <h1 className="text-center">
              <img src={require("assets/img/LAT-log.png")}  alt="" width="50%" />
            </h1>
          </Col>
          <Col md="12">
          <CardHeader>
            <div className="title">Registration</div>
          </CardHeader>
          
          <CardBody>
          <h6 className="text-success" style={{display:success}}>
              {message}
            </h6>
            <h6 className="error" style={{display:error}}>
            {message}
            </h6>
            <div style={{display:submit}}>

             <Row>
             <Col md="6">
                  <div className="input-box underline">
                    <input
                      type=""
                      placeholder="Enter Your Name"
                      required
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <div className="underline"></div>
                  </div>
                </Col>

                <Col md="6">
                  <div className="input-box underline">
                    <input
                      type=""
                      placeholder="Enter Your Mobile"
                      required
                      id="mobile"
                      value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                    <div className="underline"></div>
                  </div>
                </Col>

                <Col md="6">
                  <div className="input-box underline">
                    <input
                      type=""
                      placeholder="Enter Your Register No."
                      required
                      id="register"
                      value={registerNo}
                        onChange={(e) => setRegisterNo(e.target.value)}
                    />
                    <div className="underline"></div>
                  </div>
                </Col>


                  <Col md="6">
                  <div className="input-box ">
                  <select id="passout" required  value={passoutYear}
                        onChange={(e) => setPassoutYear(e.target.value)}>
                      <option value="">-Year of Passout-</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </Col>

                  <Col md="6">
                  <div className="input-box underline">
                    <input
                      type="gmail"
                      placeholder="Enter Your Email"
                      required
                      accept="@gmail.com"
                      id="gmail"
                      value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="underline"></div>
                  </div>
                  </Col>

                  <Col md="6">
                  <div className="input-box underline">
                    <input
                      type="password"
                      placeholder="Enter Your Password"
                      required
                      id="password"
                      value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("none");
                          chechmail();
                        }}
                    />
                    <div className="underline"></div>
                  </div>
                  </Col>

                  <Col md="6">
                  <div className="input-box underline">
                    <input
                      type="password"
                      placeholder="Re-Enter your password"
                      required
                      id="re-password"
                      value={repassword}
                        onChange={(e) => {
                          if ( password.length <= 7){
                            notify(notificationAlertRef, "tc","danger", "Password min long is  8");
                          }else{
                            setRepassword(e.target.value);
                          }
                        }}
                    />
                    <div className="underline"></div>
                  </div>
                  </Col>
                  
                  <Col md="6">
                  <div className="input-box ">
                  <select id="gender" required value={gender} onChange={(e) =>{setGender(e.target.value);handleRePassword()}}>
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </Col>
                <Col md="6">
                  <div className="input-box ">
                  <select onChange={(e) => setGraduation(e.target.value)} required value={graduation}>
                    <option value="">-Select Graduation-</option>
                    <option value="UG">UG</option>
                    <option value="PG">PG</option>
                  </select>
                  </div>
                </Col>
                <Col md="6">
                  <div className="input-box ">
                  <select required value={department} onChange={(e) => setDepartment(e.target.value)}>
  <option value="">Select Department</option>
  <option value="B.Tech. - Information Technology (IT)">B.Tech. - Information Technology (IT)</option>
  <option value="B.E - Automobile Engineering(AU)">B.E - Automobile Engineering(AU)</option>
  <option value="B.E - Civil Engineering (CE)">B.E - Civil Engineering (CE)</option>
  <option value="B.E - Computer Science and Engineering (CSE)">B.E - Computer Science and Engineering (CSE)</option>
  <option value="B.E - Electronics and Communication Engineering(ECE)">B.E - Electronics and Communication Engineering(ECE)</option>
  <option value="B.E - Electrical and Electronics Engineering(EEE)">B.E - Electrical and Electronics Engineering(EEE)</option>
  <option value="B.E - Mechnical Engineering(ME)">B.E - Mechnical Engineering(ME)</option>
  <option value="B.E - Safety and Fire Engineering(SFE)">B.E - Safety and Fire Engineering(SFE)</option>
  <option value="M.E - Structural Engineering(SE)">M.E - Structural Engineering(SE)</option>
  <option value="M.E - Construction Management and Engineering(CME)">M.E - Construction Management and Engineering(CME)</option>
  <option value="M.E - Communication System(CS)">M.E - Communication System(CS)</option>
  <option value="M.E - Power Electronics and Drives(PED)">M.E - Power Electronics and Drives(PED)</option>
  <option value="M.E - Computer Science and Engineering(CSE)">M.E - Computer Science and Engineering(CSE)</option>
  <option value="M.Tech.- Information Technology(IT)">M.Tech.- Information Technology(IT)</option>
  <option value="M.E -Industrial and Safety Engineering (ISE)">M.E -Industrial and Safety Engineering (ISE)</option>
  <option value="MBA - Master of Business Administration">MBA - Master of Business Administration</option>
  <option value="MCA - Master of Computer Application">MCA - Master of Computer Application</option>
  <option value="MCA - Master of Computer Applications">MCA - Master of Computer Applications</option>
</select>

                  </div>
                </Col>
                <Col md="12">
                      <div className="input-box">
                         <p className="text-secondary">Select your profile picture <br></br> <small className="form-text text-muted">Max file size: 5MB</small></p>
                          
                         <div className="custom-file">
                         <input type="file" className="" id="photo" name="photo" accept="image/jpeg, image/png, image/jpg" capture="camera" onChange={handleFileChange} maxSize="100" />
                          </div>
                        </div>
                  </Col>
                  <Col md="12" className="mt-5">
                  {filePath && (
                     <img src={filePath} alt="Profile Picture" className="mt-3" style={{ maxWidth: "100%" }} />
                  )}
                  </Col>

                <Col md="12" className="">
                  <div className="">
                  <div className="input-box button">
                    <input type="submit" name="" value="Submit" onClick={SetOtp} />
                  </div>
                  </div>
                </Col>
                </Row>
          </div>

            <div style={{display:verify}}>
            <Col md="6">
                  <div className="input-box underline">
                    <input
                      type=""
                      placeholder="Enter Your OTP"
                      required
                      id="otp"
                      value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className="underline"></div>
                  </div>
                  </Col>
                  <Col md="12">
                  <div className="">
                  <div className="input-box button">
                    <input type="submit" name="" value="Verify" onClick={handleSubmit}/>
                  </div>
                  </div>
                </Col>
         </div>

              <Col md="6" className="mt-2">
              <a href="/login">
                I have already account.
              </a>
            </Col>
           
          </CardBody>

          </Col>
          </Row>   
          <Container className="mt-5">
          <Row>
            <Col>
              <pre className="text-center text-secondary">
                &copy; {1900 + new Date().getYear()}, made with{" "}
                <i className="fa fa-heart heart text-dark" />
              <br/>
                Organized by{" "}
                <a href="https://ksrce.irins.org/profile/258380">Dr.G.Singaravel</a> and
                <a href="https://www.pkaveen.in" target="_blank">
                <br/> Kaveen Prasannamoorthy
                </a>
                .<br />
                Designed and Developed by{" "}
                <a href="#">Innak Team.</a>
              </pre>
            </Col>
          </Row>
        </Container>
        </Card> 
    </div>
    </>
    )
}

export default StudentRegistration;
