
import { generateApiKey } from '../Api/api';
import React, { useEffect, useState } from "react";
import NotificationAlert from 'react-notification-alert';
import { useHistory } from 'react-router-dom';
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

function User() {
  const [data, setData] = useState("");
  const [userdata, setUserdata] = useState("");
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const notificationAlertRef = React.useRef();
  const history = useHistory();

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

  const changeNewPassword = async () => {
    let verifyOldPassword = false;
    
    // Make API request to verify the old password
    if (newPassword !== "" && confirmPassword !== "" && oldPassword !== "") {
      try {
        const verifyResponse = await fetch('http://localhost:9000/verifypassword', {
          method: 'POST',
          body: JSON.stringify({
            type: data.verify.type,
            email: data.verify.email,
            password: oldPassword
          }),
          headers: {
            'Content-Type': 'application/json',
            'apikey': generateApiKey()
          }
        });
  
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          console.log(verifyData);
          
          if (newPassword !== confirmPassword) {
            notify(notificationAlertRef, "tc", "danger", "New and Confirm Passwords does not match. Please try again.");
            return;
          }
          
          console.log("Password verified");
          verifyOldPassword = true;
        } else {
          throw new Error("Failed to verify old password");
        }
      } catch (error) {
        notify(notificationAlertRef, "tc", "danger", "Old Password is  Incorrect.");
        return;
      }
    } else {
      notify(notificationAlertRef, "tc", "danger", "Fill all details.");
      return;
    }
  
    if (verifyOldPassword === true) {
      console.log("change password condition")
      // Make API request to change the password
      try {
        const changePasswordResponse = await fetch('http://localhost:9000/changepassword', {
          method: 'POST',
          body: JSON.stringify({
            type: data.verify.type,
            email: data.verify.email,
            password: confirmPassword
          }),
          headers: {
            'Content-Type': 'application/json',
            'apikey': generateApiKey()
          }
        });
      console.log(changePasswordResponse)
      if (changePasswordResponse.status === 200){
        notify(notificationAlertRef, "tc", "success", "Password changed Successfully");
      }else {
          throw new Error("Failed to change password");
        }
      } catch (error) {
        notify(notificationAlertRef, "tc", "danger", "Failed to change password");
        return;
      }
    }
  };
  
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      fetchData();
    }else{
      history.push({ pathname: "/" });
    }
  }, []);
  return (
    <>
      <div className="content">
         <div>
        <NotificationAlert ref={notificationAlertRef} />
    </div>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Change Password</CardTitle>
              </CardHeader>
              <CardBody>
                  <FormGroup>
                    <label htmlFor="oldPassword">Old Password</label>
                    <Input type="password" value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} required />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="newPassword">New Password</label>
                    <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
                  </FormGroup>
                  <CardFooter className="text-center">
                    <Button color="primary" type="submit" onClick={changeNewPassword} >Submit</Button>
                  </CardFooter>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
