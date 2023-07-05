import React, { useState, useRef, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, CardTitle, Row, Col } from "reactstrap";
import Chart from "chart.js/auto";

import { generateApiKey } from '../Api/api';
function Dashboard() {
  const history = useHistory();
  const [loginDetails, setLoginDetails] = useState([]);
  const chartRef = useRef();
  const fetchData = async () => {
    try {
        const response = await fetch(
          `http://localhost:9000/getStudentLoginDetails`,
          {
            headers: {
              "Content-Type": "application/json",
              "apikey": generateApiKey()
            }
          }
        );
        const data = await response.json();
        setLoginDetails(data.data);
        console.log(data);
    } catch (error) {
      console.error("Failed to verify login:", error);
      history.push({pathname: '/login'});
    }
  }

  useEffect(() => {
      fetchData();
  }, []);

 useEffect(() => {
  if (loginDetails.length) {
    const userLoginCounts = loginDetails.reduce((acc, curr) => {
      const { login_email } = curr;
      acc[login_email] = acc[login_email] ? acc[login_email] + 1 : 1;
      return acc;
    }, {});

    const labels = Object.keys(userLoginCounts);
    const data = Object.values(userLoginCounts);

    const chartData = {
      labels,
      datasets: [
        {
          label: "Number of Logins",
          data,
          fill: false,
            borderColor: "#1e90ff",
             backgroundColor: "transparent",
             pointBorderColor: "#1e90ff",
            pointBackgroundColor: "#fff",
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBorderWidth: 2,
            pointHoverBackgroundColor: "#1e90ff",
           pointHitRadius: 10,
            lineTension: 0.4,
             showLine: true,
            tension: 0.4,
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Login Details"
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    const chart = new Chart(chartRef.current, {
      type: "line",
      data: chartData,
      options: chartOptions
    });

    return () => {
      chart.destroy();
    };
  }
}, [loginDetails]);
     return (
          <>
          <div className="content">
            <Row>
              <Col md="12" lg="6" >
                <Card className="card-chart">
                  <CardHeader>
                    <CardTitle tag="h5">Students  Login Details</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div>
                      <canvas ref={chartRef} />
                    </div>
                  </CardBody>
                  <CardFooter>
                    <div className="stats">
                      <i className="fa fa-history" />
                        Updated 3 minutes ago
                    </div>
                  </CardFooter>
                </Card>
             </Col>
            </Row>
          </div>
          </>
          );
          }
          export default Dashboard;