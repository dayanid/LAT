import React, { useState } from "react";
import "../assets/css/login.css";
import { generateApiKey } from '../Api/api';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Container
} from "reactstrap";

function Forgot() {
 
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("none");
  const [error, setError] = useState("none");
  const [form, setFrom] = useState("");

  // Generate a random password of specified length
function generateRandomPassword(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

  const checkMail = () => {
    if (email === "") {
      setMessage("First enter your email");
      setError("");
      setSuccess("none");
    } else {
      if (email.endsWith("@gmail.com")) {
        const headers = {
          apikey: generateApiKey()
        };
  
        // Make API request to check if email exists
        fetch(`http://localhost:9000/checkmail/${email}`, {
          method: 'GET',
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
            if (data.result.found === true) {
              console.log("Email exists");
              
                if(type == ""){
                  setMessage(`Select User Mode.`);
                  setError("");
                  setSuccess("none");               
                }
                else if (type == "student"){
                  setMessage(`please wait...`);
                  setError("none");
                  setSuccess("");

                  // Example usage: generate a random password of length 10
                  let password = generateRandomPassword(10);    
                  const apiUrl = 'http://localhost:9000/StudentChangePassword';
                  const requestBody = JSON.stringify({
                    student_email: email,
                    student_password: password
                  });

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
                      if (data.status == true){
                        console.log("success:", data.message);
                        const requestBody = JSON.stringify({
                          mail: email,
                          password: password
                        });
                        fetch("http://localhost:9000/findaccount", {
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
                              throw new Error("Failed to create Find account.");
                            }
                          })
                          .then(data => {
                            // Handle data from response
                            if (data.status == true){
                              console.log("success:", data.message);
                              setFrom("none");
                              setMessage(`login details sent you mail ${email}`);
                              setError("none");
                              setSuccess("");  
                            }
                          })
                          .catch(error => {
                            // Handle fetch error
                            console.error("Failed to Find Account", error);
                          });
                      }
                    })
                    .catch(error => {
                      // Handle fetch error
                      console.error("Failed to change password", error);
                    });
                }
            } else {
              console.log("Email does not exist");
              setMessage(`${email} does not exist`);
              setError("");
              setSuccess("none");
              setEmail("");
            }
          })
          .catch(error => {
            // Handle fetch error
            console.error("Failed to verify email", error);
          });
  
      } else {
        setMessage("Enter a valid email ending with @gmail.com");
        setError("");
        setSuccess("none");
      }
    }
  };
  
  return (

    <div className="sign" style={{height:"100%"}}>
      
        <Card className="box">
          <CardHeader>
            <h1 className="text-center">
              <img src="https://innak-crew.github.io/LAT-logo.png" alt="" width="80%" />
            </h1>
            
            <div className="title">Find Account</div>
          </CardHeader>
          <CardBody>
            <div >
            <h6 className="text-success" style={{display:success}}>
              {message}
            </h6>
            <h6 className="error" style={{display:error}}>
            {message}
            </h6>
              <Row className="" style={{display:form}}>
                <Col md="12">
                  <div className="input-box ">
                    <select 
                    id="Mode" 
                    required  
                    value={type}
                      onChange={(e) => setType(e.target.value)}>
                      <option value="">Select User Mode</option>
                      <option value="master">Master</option>
                      <option value="admin">Admin</option>
                      <option value="student">Student</option>
                    </select>
                  
                  </div>
                </Col>

                <Col md="12">
                  <div className="input-box underline">
                    <input
                      type=""
                      placeholder="Enter Your Email"
                      required
                      accept="gmail.com"
                      id="gmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="underline"></div>
                  </div>
                </Col>

               
                <Col md="12">
                  <div className="input-box button">
                    <input type="submit" name="" value="Find" onClick={checkMail} />
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col md="6" className="mt-2">
              <a href="/login">
                I Know my account
              </a>
            </Col>
            </Row>
          </CardBody>
          <Container className="mt-5">
          <Row>
            <Col>
              <pre className="text-center text-secondary">
                &copy; {1900 + new Date().getYear()}, made with{" "}
                <i className="fa fa-heart heart text-dark" />
              <br/>
                Organized by{" "}
                <a href="#">Dr.G.Singaravel</a> and
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
    )
}

export default Forgot;
