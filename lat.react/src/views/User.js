
import React, { useEffect, useState } from "react";

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
  Col
} from "reactstrap";

function User() {
  const [data, setData] = useState("");
  const [userdata, setUserdata] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:9000/VerifyLogin", {
        method: "POST",
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
        setData(responseData);
        console.log(data.verify);
        const secondResponse = await fetch(`http://localhost:9000/getStudentByEmail/${responseData.verify.email}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'apikey': generateApiKey()
          }
        });
        if (!secondResponse.ok) {
          throw new Error("Failed to fetch data");
        }
        const secondResponseData = await secondResponse.json();
        if (secondResponseData.status=== true && secondResponseData.data) {
          setUserdata(secondResponseData.data);
          console.log(secondResponseData);
        }
      }else if (responseData.status === false){
        sessionStorage.removeItem('token');
      }
    } catch (error) {
      console.error("Failed to verify login:", error);
      sessionStorage.removeItem('token')
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      fetchData();
    }
  }, []);

  return (
    <>
      <div className="content">
        <Row className="mx-5">
          <Col md="4">
            <Card className="card-user mt-5">
            
              <CardBody>
                <div className="author">
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={require("assets/img/user.png")}
                    />
                    <h5 className="title">{userdata.student_name}</h5>
                  <p className="description">{userdata.student_department}</p>
                </div>
               
              </CardBody>
              
            </Card>
            
          </Col>
          <Col md="8">
            <Card className="card-user">
              <CardHeader>
                <CardTitle tag="h5">Profile</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                <Row>
                  <Col md="6">
                      <FormGroup>
                        <label>Name</label>
                        <Input
                          defaultValue=""
                          placeholder="First Name"
                          type="text"
                          value={userdata.student_name}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label  >RegisterNo</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={userdata.student_registerno} 
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col  md="4">
                      <FormGroup>
                        <label>Phone no</label>
                        <Input
                          defaultValue=""
                          placeholder="phone no"
                          type="text"
                          value={userdata.student_mobile} 
                          disabled/>
                      </FormGroup>
                    </Col>
                    <Col  md="6">
                      <FormGroup>
                        <label >
                          Email address
                        </label>
                        <Input 
                        placeholder="Email" 
                        type="email" 
                        value={userdata.student_email} 
                        disabled/>
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Department</label>
                        <Input
                          defaultValue=""
                          placeholder="Home Address"
                          type="text"
                          value={userdata.student_department}
                          disabled/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col  md="4">
                      <FormGroup>
                        <label>Gender</label>
                        <Input
                          defaultValue=""
                          placeholder=""
                          type="text"
                          value = {userdata.student_gender}
                          disabled />
                      </FormGroup>
                    </Col>
                    <Col  md="4">
                      <FormGroup>
                        <label>Passout Year</label>
                        <Input
                          defaultValue=""
                          placeholder=""
                          type="text"
                          value={userdata.student_passout}
                          disabled />
                      </FormGroup>
                    </Col>
                    <Col  md="4">
                      <FormGroup>
                        <label>Graduation</label>
                        <Input 
                        placeholder="" type=""
                        value={userdata.student_graduation}
                        disabled  />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                   
                  </Row>
                  <Row>
                    <div className="update ml-auto mr-auto">
                      <Button
                        className="btn-round"
                        color="primary"
                        type="submit"
                        disabled
                      >
                        Update Profile
                      </Button>
                    </div>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
