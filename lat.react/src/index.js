import React, { useEffect, useState } from "react";
import { generateApiKey } from './Api/api';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Switch, Redirect, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AdminLayout from "layouts/Admin.js";
import MainLayout from "layouts/main.js";
import StudentLayout from "layouts/Student.js";
import LoginLayout from "layouts/Login.js";
import ForgetLayout from "layouts/ForgotPassword.js";
import RegistrationLayout from "layouts/Registration.js";
import CompilerLayout from "layouts/Compiler";

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const fetchData = async () => {
        try {
          const response = await fetch("http://localhost:9000/VerifyLogin", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'apikey': generateApiKey()
            },
            body: JSON.stringify({ token })
          });
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const responseData = await response.json();
          console.log(responseData);
          if (responseData.status && responseData.verify) {
            setData(responseData);
            console.log(responseData);
            const path = responseData.verify.type  === "student" ? "/student/dashboard" : "/admin/dashboard";
           // history.push({ pathname: path });
          } else if (responseData.status === false) {
            sessionStorage.removeItem('token');
          }
        } catch (error) {
          setError(error.message);
          console.error("Failed to verify login:", error);
          sessionStorage.removeItem('token');
        }
      };
      fetchData();
      console.log(token);
    }
  }, [history]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/student" render={(props) => <StudentLayout {...props} />} />
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Route path="/compiler" render={(props) => <CompilerLayout {...props} />} />
        <Route path="/login" render={(props) => <LoginLayout {...props} />} />
        <Route path="/student-registration" render={(props) => <RegistrationLayout {...props} />} />
        <Route path="/forget" render={(props) => <ForgetLayout {...props} />} />
        <Route exact path="/" render={(props) => <MainLayout {...props} />} />
        {data && data.verify && data.verify.type === "student" && (
          <Redirect from="/" to="/student/dashboard" />
        )}
        {data && data.verify && data.verify.type === "admin" && (
          <Redirect from="/" to="/admin/dashboard" />
        )}
      </Switch>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(<App />);
