import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { generateApiKey } from '../../Api/api';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Container
} from "reactstrap";

import Adminroutes from "admin_routes.js";
import Studenroutes from "student_routes.js";

function Header(props) {
  const [data, setData] = useState("");
  const [userdata, setUserdata] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const location = useLocation();
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
        await setData(responseData.verify.type);
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
      sessionStorage.removeItem('token');
      history.push({pathname: '/' });
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      fetchData();
    }
  }, []);

  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };
  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };
  const getBrand = () => {
    let brandName = "";
    Adminroutes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    Studenroutes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });

    return brandName;
  };
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };
  
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);

  function handleLogout() {
    sessionStorage.removeItem("token");
    // redirect to login page or do other post-logout actions
    history.push({ pathname: '/'});
  }
  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar
      color={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "transparent"
          : color
      }
      expand="lg"
      className={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "transparent")
      }
    >
     
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand href="/">{getBrand()}</NavbarBrand>
        </div>
       
   
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
        <h6>
          {userdata.student_name !== undefined ? `${userdata.student_name} (${userdata.student_registerno})` : "Admin"}
        </h6>
        </Collapse>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
        <h6 style={{cursor:"pointer"}} onClick={handleLogout}>
          Logout
        </h6>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
