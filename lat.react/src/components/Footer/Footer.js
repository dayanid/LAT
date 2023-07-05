import React from "react";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";

function Footer(props) {
  return (
    <footer className="text-center" style={{ alignItems: "center" }}>
      <Container fluid={props.fluid ? true : false}>
        <Row>
          <Col>
            <div className="text-center text-secondary">
              &copy; {1900 + new Date().getYear()}, made with{" "}
              <i className="fa fa-heart heart text-dark" />
            </div>
            <div className="text-center text-secondary">
              Organized by{" "}
              <a href="https://ksrce.irins.org/profile/258380" target="_blank">Dr.G.Singaravel</a> and{" "}
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
    </footer>
  );
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool
};

export default Footer;
