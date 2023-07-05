import React, { useEffect} from "react";
import "../assets/css/login.css";
import { generateApiKey } from '../Api/api';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Container
} from "reactstrap";

import { useHistory } from 'react-router-dom';
function Main() {
  
  const history = useHistory();
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

  return (
    <code className="sign text-center" style={{ height: "100%" }}>
      <Card className="box">
        <CardHeader>
          <h1 className="text-center">
            <img
              src={require("assets/img/LAT-log.png")} 
              alt=""
              width="80%"
            />
          </h1>
          <div className="title text-left">Welcome to LAT</div>
          <code className="text-success">
           <h3>Logical Assessment Training</h3> 
          </code> {/* added message about LAT */}
          <h5 className="text-primary">
            "The journey of a thousand lines of code begins with a single step."
          </h5>{/* added message about LAT */}
        </CardHeader>
        <CardBody>
          <div>
            <Row>
            <Col md="6">
                <Button className="btn btn-primary " type="submit" name="" value="Login" href="/login">
                     Login
                </Button>
            </Col>
            <Col md="6">
               
                <Button
                    className="btn btn-primary "
                    type="submit"
                    name=""
                    value="Register"
                     href="/student-registration"
                >
                      Register
                </Button>

            </Col>

 
            </Row>
          </div>
        </CardBody>
        <Container className="mt-5">
          <Row>
            <Col>
              <div className="text-center text-secondary">
                &copy; {1900 + new Date().getYear()}, made with{" "}
                <i className="fa fa-heart heart text-dark" />
              <br/>
                Organized by{" "}
                <a href="https://ksrce.irins.org/profile/258380">Dr.G.Singaravel</a> and{" "}
                <a href="https://www.pkaveen.in" target="_blank">
                  Kaveen Prasannamoorthy
                </a>
                .<br />
                Designed and Developed by{" "}
                <a href="#">Innak Team.</a>
              </div>
            </Col>
          </Row>
        </Container>
      </Card>
    </code>
  );
}

export default Main;
