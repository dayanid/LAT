import React, { useState, useEffect } from "react";

import { generateApiKey } from '../Api/api';
// reactstrap components
import {InputGroupText,InputGroupAddon,InputGroup, Card, CardHeader, CardBody,  Table, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup,Form,Input } from "reactstrap";

function ListAssessment() {

    const [Programsdata, setProgramsdata] = useState([]);
    const [Studantsdata, setStudantsdata] = useState([]);
    const [Questionsdata, setQuestionsdata] = useState([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [Name, setName] = useState('');
    const [Question, setQuestion] = useState('');
    const [ID, setID] = useState('');
    const [SID, setSID] = useState('');
    const [PID, setPID] = useState('');
    const [Time_to_complete, setTime_to_complete] = useState("");
    const [Attend_Date, setAttend_date] = useState('');
    const [RunCount, setRunCount] = useState('');
    const [Language, setLanguage] = useState('');
    const [RunTime, setRuntime] = useState([]);
    


    useEffect(() => {
        fetch(`http://localhost:9000/listStudentPrograms`, {
          headers: {
            apikey: generateApiKey()
          }
        })
          .then(response => response.json())
          .then(data => {
            setProgramsdata(data);
            
          })
          .catch(error => console.error(error));
      }, []);
    
      const ProgramsdataFilter = async (Q) => {
        try {
          const response = await fetch(`http://localhost:9000/listStudentPrograms?q=${Q}`, {
            headers: {
              apikey: generateApiKey()
            }
          });
          const data = await response.json();
          setProgramsdata(data);
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      };
      
      const getName = async (id) => {
        try {
          const response = await fetch(`http://localhost:9000/getStudentById/${id}`, {
            headers: {
              apikey: generateApiKey()
            }
          });
          const data = await response.json();
          setName(data.data.student_name);
        } catch (error) {
          console.error(error);
        }
      };
      
      const getQuestion = async (id) => {
        try {
          const response = await fetch(`http://localhost:9000/getQuestion/${id}`, {
            headers: {
              apikey: generateApiKey()
            }
          });
          const data = await response.json();
          setQuestion(data.data.question_text);
          setPID(data.data.question_id); // pass the correct question_id
        } catch (error) {
          console.error(error);
        }
      };
      
      const handleViewStudent = async (ProgramId) => {
        const selectedProgram = Programsdata.data.find(Programsdata => Programsdata.student_program_id === ProgramId);
        setSelectedProgram(selectedProgram);
        setID(selectedProgram.student_program_id);
        setSID(selectedProgram.student_id);
        await getName(selectedProgram.student_id);
        await getQuestion(selectedProgram.question_id); // pass the question_id
        setTime_to_complete(selectedProgram.time_to_complete);
        setLanguage(selectedProgram.program_language);
        const attendDateString = selectedProgram.attend_date;
        const attendDate = new Date(attendDateString);
        // Convert to IST
        const options = { timeZone: 'Asia/Kolkata' };
        const attendDateIST = attendDate.toLocaleString('en-IN', options);
        setAttend_date(attendDateIST);
        setRunCount(selectedProgram.run_count);
        setRuntime(JSON.parse(selectedProgram.run_time));
        setIsViewModalOpen(true);
      };
      
  
  const handleCloseModal = () => {
    setSelectedProgram(null);
    setIsViewModalOpen(false); 
  };


  const tableRows = Programsdata?.data?.map((program, index) => (
    <tr key={program.student_id} className="text-left">
      <td>{index + 1}</td>
      <td>{program.student_id}</td>
      <td>{program.question_id}</td>
      <td>{program.time_to_complete}</td>
      <td>
      <span onClick={() => handleViewStudent(program.student_id)} className="btn btn-primary ml-1" style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
              </svg>
            </span>
      </td>
    </tr>
  ));

  return (
    <>
    <div className="content">
    <Row>
      <Col md="12">
        <Card>
        <CardHeader>
  <InputGroup className="">
    <Input
      placeholder="Search..."
      onChange={e => ProgramsdataFilter(e.target.value)} 
    />
    <InputGroupAddon addonType="append">
      <InputGroupText>
        <i className="nc-icon nc-zoom-split" />
      </InputGroupText>
    </InputGroupAddon>
  </InputGroup>
  </CardHeader>
          <CardBody>
            {/* Table */}
            <Table striped bordered hover>
              <thead className="text-primary">
                <tr className="text-left">
                  <th>Sno</th>
                  <th>Student ID</th>
                  <th>Question ID</th>
                  <th>Complete Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
    </div>

     {/* view Question Modal */}
     <Modal isOpen={isViewModalOpen} toggle={handleCloseModal} style={{width:"90%"}}>
        <ModalHeader toggle={handleCloseModal}><h6 className=" text-primary">View Program Details</h6></ModalHeader>
        <ModalBody>
          {/* Render View Student form */}
          {selectedProgram && (
            <div>
              <Form>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Name</label>
                        <Input
                          type=""
                          defaultValue=""
                          value={Name} 
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Time to complete</label>
                        <Input
                          type=""
                          defaultValue=""
                          value={Time_to_complete} 
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <label>Question</label>
                        <Input
                          type=""
                          defaultValue=""
                          value={Question} 
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Attend Date</label>
                        <Input
                          type=""
                          defaultValue=""
                          value={Attend_Date} 
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                    <FormGroup>
                      <label>language</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={Language}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                    
                    <Col md="6">
                      <FormGroup>
                        <label>Total Run Counts</label>
                        <Input
                          type=""
                          defaultValue=""
                          value={RunCount} 
                          disabled
                        />
                      </FormGroup>
                    </Col>
                   
                  </Row>
              {RunTime.run_time.map((run, index) => (
                <Row key={index}>
                  <Col md="12">
                    <h6>Run time : {index + 1}</h6>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Testcaes</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={run.testcase}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Number of lines</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={run.line}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Number of letters</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={run.letters}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label>Code</label>
                      <Input
                        type="textarea"
                        defaultValue=""
                        value={run.code}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Input</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={run.input}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label>Output</label>
                      <Input
                        type="textarea"
                        defaultValue=""
                        value={run.output}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  </Row>
              ))}

                </Form>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
     
    </>
  );
}

export default ListAssessment;