import React, { useState, useRef  ,useEffect} from "react";
import "../assets/css/login.css";
import NotificationAlert from 'react-notification-alert';
import { useHistory } from 'react-router-dom';
import { generateApiKey } from '../Api/api';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Container
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

function Login() {
   const history = useHistory();
   const notificationAlertRef = React.useRef();
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:9000/VerifyLogin", {
          method:"POST",
          headers: {
            'Content-Type': 'application/json',
            'apikey': generateApiKey()
          },
          body: JSON.stringify({ token: sessionStorage.getItem("token") })
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        if (responseData.status && responseData.verify && responseData.verify.type === "student") {
         //window.location.href="/student/dashboard"
         history.push({pathname: '/student/dashboard'});
        }else if (responseData.status && responseData.verify && responseData.verify.type === "admin") {
          //window.location.href="/admin/dashboard"
          history.push({pathname: '/admin/dashboard'});
         }
        else if (responseData.status === false){
          sessionStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Failed to verify login:", error);
        sessionStorage.removeItem('token')
      }
    };
     
    if (sessionStorage.getItem("token")){
      fetchData();
    }
   
  }, []);

  let headers = {
    apikey: generateApiKey()
  };

  const checkUser = () => {
    if (type === "") {
      notify(notificationAlertRef, "tc","danger", "Select User Type");
    } else if (email === "") {
      notify(notificationAlertRef, "tc","danger", "First Enter your mail");
    } else if (password === "") {
      notify(notificationAlertRef, "tc","danger", "First Enter your Password");
    } else {
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
              //console.log("Email exists");
              loginUser();
            } else {
              //console.log("Email does not exist");
              setEmail("");
              notify(notificationAlertRef, "tc","danger", `${email} does not exist`);
            }
          })
          .catch(error => {
            // Handle fetch error
           // console.error("Failed to verify email", error);
          });
    }
  };
  
  const loginUser = () => {
    // Make API request to Login
    fetch(`http://localhost:9000/Login`, {
      method: 'POST',
      body: JSON.stringify({
        type:type,
        email: email,
        password: password
      }),
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
          throw new Error("Failed to Login");
        }
      })
      .then(data => {
        console.log(data);
        // Handle data from response
        if (data.status === true) {
          notify(notificationAlertRef, "tc","success",data.message);
          sessionStorage.setItem('token', data.token);
          window.location.reload();
        } else {
          notify(notificationAlertRef, "tc","danger", "password Incorrect");
        }
      })
      .catch(error => {
        // Handle fetch error
        //console.error("Failed to verify email", error); // Update error message
        notify(notificationAlertRef, "tc","danger", "Failed to Login. Password Incorrect.");
      });
  };
  return (

    <div className="sign" style={{height:"100%"}}>
         <div>
        <NotificationAlert ref={notificationAlertRef} />
    </div>

        <Card className="box">
      

          <CardHeader>
            <h1 className="text-center">
              <img src={require("assets/img/LAT-log.png")} alt="" width="80%" />
            </h1>
            
            <div className="title">Login</div>
          </CardHeader>
          <CardBody>
            <div>
              <Row>
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

                <Col md="">
                  <div className="input-box underline">
                    <input
                      type=""
                      placeholder="Enter Your Email"
                      required
                      accept="gmail.com"
                      id="gmail"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    <div className="underline"></div>
                  </div>
                </Col>

                <Col md="12">
                  <div className="input-box">
                    <input
                      type="password"
                      placeholder="Enter Your Password"
                      required
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <div className="underline"></div>
                    
                  </div>
                </Col>
                <Col md="12">
                  <div className="input-box button">
                    <input type="submit" name="" value="Login" onClick={checkUser}/>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
            <Col md="6" className="mt-2">
              <a href="/forget">
                Forgot Password?
              </a>
              </Col>
              <Col md="6" className="mt-2">
              <a href="/student-registration">
                Student register
              </a>
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
     
          </CardBody>
         
        </Card>  
    </div>
    )
}

export default Login;
