import { Container, Row, Col } from "reactstrap";
import "../assets/scss/credits.scss";

const Credits = () => {
  return (
    <div className="credits-container">
      <Container>
        <h1 className="credits-title mt-4">Project Team</h1>
        <Row>
          <Col md={3}>
            <div className="team-member">
              <p className="team-member-role">Organized By</p>
              <img
                src="https://ksrce.irins.org/assets/profile_images/258380.png"
                alt="Team Member"
                className="team-member-image"
              />
              <h3 className="team-member-name">Dr. Singaravel G</h3>
              <h4 className="team-member-position">
                Professor & Head of the Department
              </h4>
              <h4 className="team-member-department">Information Technology</h4>
              <p>
                K S R Kalvi Nagar Tiruchengode, Namakkal District, Tamil Nadu.
              </p>

              <a
                href="https://ksrce.irins.org/profile/258380"
                className="btn btn-custom"
                target="_blank">
                More details
              </a>
            </div>
          </Col>
          <Col md={3}>
            <div className="team-member">
              <p className="team-member-role">Organized & Guided By</p>
              <img
                src="https://unborn.in/assets/img/logo/logo.png"
                alt="Team Member"
                className="team-member-image"
              />
              <h3 className="team-member-name">Unborn Solutions LLP</h3>
              <p>
                11, KK Complex, Opp GH, Cuddalore Main Road, Uthangarai 635207,
                Krishnagiri District, Tamilnadu, India.
              </p>
              <a href="https://unborn.in/" className="btn btn-custom" target="_blank">
                
              More details
              </a>
            </div>
          </Col>
          <Col md={6}>
            <h1 className="credits-title">Developed By</h1>
            <div className="d-flex justify-content-between">
              <div className="team-member_0">
                <img
                  src="https://media.licdn.com/dms/image/D5603AQHQifN9N75viA/profile-displayphoto-shrink_400_400/0/1687107269330?e=1694044800&v=beta&t=d51WHFe11QyCnuYJPsUs6YQS2wkFhg4UnK0RQSYhAcE"
                  alt="Team Member"
                  className="team-member-image"
                />
                <h4 className="team-member-name"> <b>Dayanidi GV</b></h4>
                <b>B.Tech.Information Technology </b>
                <p>Batch (2021 - 2025)</p>
                <p> K.S.R. College of Engineering (Autonomous) </p>
                <p>
                  K S R Kalvi Nagar Tiruchengode, Namakkal District, Tamil Nadu
                </p>
                <a href="https://dayanidiportfolio.github.io/" className="btn btn-custom" target="_blank">
                
                More details
                </a>
              </div>
              <div className="border-left team-member_0  border-left-danger border-left-4 border-left-dashed">
                <img
                  src="https://media.licdn.com/dms/image/D5603AQG5W7HxsLFl1g/profile-displayphoto-shrink_400_400/0/1688048283533?e=1694044800&v=beta&t=CPXbLis9kTwO6NUcLtp0JOYkCsUHM8PIRAEILonqB3o"
                  alt="Team Member"
                  className="team-member-image"
                />
                <h4 className="team-member-name"><b>Hari Prasath S</b>  </h4>
                <b>B.Tech.Information Technology </b>
                <p>Batch (2021 - 2025)</p>
                <p> K.S.R. College of Engineering (Autonomous) </p>
                <p>
                  K S R Kalvi Nagar Tiruchengode, Namakkal District, Tamil Nadu
                </p>
                <a href="https://www.linkedin.com/in/hari-prasath-selvan-shp0420/" className="btn btn-custom" target="_blank">
                
                More details
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Credits;