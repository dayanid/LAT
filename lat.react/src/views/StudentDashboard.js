import React, { useState, useRef, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, CardTitle, Row, Col } from "reactstrap";
import Chart from "chart.js/auto";

import { generateApiKey } from '../Api/api';
function Dashboard() {
  const history = useHistory();
  const [loginDetails, setLoginDetails] = useState([]);
  const [userdata, setUserdata] = useState("");
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef();

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
        setUserdata(responseData);
        console.log(responseData.verify);
        const response = await fetch(
          `http://localhost:9000/getStudentLoginDetailsByEmail/${responseData.verify.email}`,
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
    }else{
      history.push({ pathname: "/" });
    }
  }, []);

  useEffect(() => {
    if (loginDetails.length) {
      const loginCountByDate = loginDetails.reduce((acc, curr) => {
        const date = curr.created_at.split("T")[0];
        acc[date] = acc[date] ? acc[date] + 1 : 1;
        return acc;
      }, {});
      const labels = Object.keys(loginCountByDate);
      const data = Object.values(loginCountByDate);  
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
                    <CardTitle tag="h5">Daily Login Count</CardTitle>
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