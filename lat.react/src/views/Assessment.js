
import React, {useEffect, useState } from "react";
// reactstrap components
import {InputGroupText,InputGroupAddon,InputGroup,Label, Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup,Form,Input, Alert } from "reactstrap";
import { useHistory } from 'react-router-dom';

import { generateApiKey } from '../Api/api';
function Assessment() {
  const history = useHistory();
    const [data, setData] = useState("");
    const [userdata, setUserdata] = useState("");
    const [questions, setQuestions] = useState([]);
    const [filterquestions, setFliterQuestions] = useState([]);
    const [attemptquestions, setAttemptQuestions] = useState([]);
    const [completequestions, setCompletedQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [ID, setID] = useState('');
    const [isQuestion, setIsQuestion] = useState("block");
    const [isAttemptQuestion, setIsAttemptQuestion] = useState("none");
    const [isCompletedQuestion, setIsCompletedQuestion] = useState("none");
    const [isQuestionActive, setIsQuestionActive] = useState(true);
    const [isAttemptQuestionActive, setIsAttemptQuestionActive] = useState(false);
    const [isCompletedQuestionActive, setIsCompletedQuestionActive] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [Studantsdata, setStudantsdata] = useState([]);
    const [Questionsdata, setQuestionsdata] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [Name, setName] = useState('');
    const [Question, setQuestion] = useState('');
    const [studentEmail, setStudantEmail] = useState('');
    const [AID, setAID] = useState('');
    const [Time_to_complete, setTime_to_complete] = useState("");
    const [Attend_Date, setAttend_date] = useState('');
    const [Attend_time, setAttend_time] = useState('');
    const [RunCount, setRunCount] = useState('');
    const [Language, setLanguage] = useState('');
    const [RunTime, setRuntime] = useState([]);

   
    const fetchData = async () => {
      fetch("http://localhost:9000/listQuestions", {
        headers: {
          apikey: generateApiKey()
        }
      })
        .then(response => response.json())
        .then(data => {
          setQuestions(data.data);
        })
        .catch(error => console.error(error));

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
          try {
            const completeResponse = await fetch(
              `http://localhost:9000/getAssessmentByStudentEmail/${responseData.verify.email}?assessment_status=completed`,
              {
                headers: {
                  apikey: generateApiKey(),
                },
              }
            );
          
            if (!completeResponse.ok) {
              throw new Error("Failed to fetch data");
            }
            var completeData = await completeResponse.json();
            setCompletedQuestions(completeData.data);
            console.log("completed:",completeData);
          } catch (error) {
            console.error("Failed to fetch questions:", error);
          }
          try {
            const attemptResponse = await fetch(
              `http://localhost:9000/getAssessmentByStudentEmail/${responseData.verify.email}?assessment_status=attempted`,
              {
                headers: {
                  apikey: generateApiKey(),
                },
              }
            );
          
            if (!attemptResponse.ok) {
              throw new Error("Failed to fetch data");
            }
          
            const attemptData = await attemptResponse.json();
            setAttemptQuestions(attemptData);
            console.log(attemptData);
            let filteredQuestions = [];


            if (completeData?.data && attemptData?.data) {
              filteredQuestions = questions.filter((question) => {
                const isAttempted = attemptData.data.some((attempt) => attempt.question_id === question.question_id);
                const isCompleted = completeData.data.some((complete) => complete.question_id === question.question_id);
                
                return !isAttempted && !isCompleted;
              });
            } else if (attemptData?.data) {
              filteredQuestions = questions.filter((question) => {
                const isAttempted = attemptData.data.some((attempt) => attempt.question_id === question.question_id);
                
                return !isAttempted;
              });
            } else {
              filteredQuestions = questions;
            }
            setFliterQuestions(filteredQuestions);
               
          } catch (error) {
            console.error("Failed to fetch questions:", error);
          }
          

        }else if (responseData.status === false){
          sessionStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Failed to verify login:", error);
        sessionStorage.removeItem('token')
        window.location.reload();
      }
    }
  
    useEffect(() => {
      if (sessionStorage.getItem("token")) {
        fetchData();
      }
    }, []);
  


    const handleTakeAssessment =(questionId)=>{
      history.push({
        pathname: '/compiler',
        state: { questionId: questionId , studentEmail:data.verify.email}
      });
    }

    const handleViewAssessment = (assessment_id) => {
      if (!completequestions || !assessment_id) {
        console.error('Incomplete data: cannot find selected program.');
        return null;
      }
      const selectedProgram = completequestions.find(Programsdata => Programsdata.assessment_id === assessment_id);
      if (!selectedProgram) {
        console.error(`Program not found with assessment id: ${assessment_id}`);
        return null;
      }
      console.log(selectedProgram);
        setSelectedProgram(selectedProgram);
        setID(selectedProgram.assessment_id);
        setQuestion(selectedProgram.question_text); 
        setLanguage(selectedProgram.language);
        setTime_to_complete(selectedProgram.time_to_complete);
        
        const attendDateString = selectedProgram.attend_date;
        console.log("attendDateString:", attendDateString);
        const attendDate = new Date(attendDateString);
        // Convert to IST
        const options = { timeZone: 'Asia/Kolkata' };
        const attendDateIST = attendDate.toLocaleString('en-IN', options);
        setAttend_date(attendDateIST.split(',')[0]);

        const [hours, minutes, seconds] = selectedProgram.attend_time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
        const Timeoptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        const outputTime = date.toLocaleTimeString('en-US', Timeoptions);
        setAttend_time(outputTime);
        setRunCount(selectedProgram.run_count);
        setRuntime(JSON.parse(selectedProgram.run_time));
        setIsViewModalOpen(true);
      return selectedProgram;
    }
    

    const handleCloseModal = () => {
      setSelectedProgram(null);
      setIsViewModalOpen(false); 
    };
  
   
    let QuestiontableRows = questions?.map((question, index) => (
      <tr key={question.question_id}>
        <td>{index + 1}</td>
        <td>{question.question_text}</td>
        <td>
        <span title="Take Assessment" onClick={() => handleTakeAssessment(question.question_id)} className="btn btn-info ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
  </svg>
          </span>
        </td>
      </tr>
    ));

    

  const CompletedtableRows = completequestions?.map((assessment, index) => (
  <tr key={assessment.question_id}>
    <td>{index + 1}</td>
    <td>{assessment.attend_date.split("T")[0]}</td>
    <td>{assessment.question_text}</td>
  <td>{assessment.language}</td>
  <td>{assessment.mark}</td>
    <td>
    <span title="View Assessment" onClick={() => handleViewAssessment (assessment.assessment_id)} className="btn btn-info ml-1">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
              </svg>
      </span>
    </td>
  </tr>
));


const AttempttableRows = attemptquestions.data?.map((assessment, index) => (
<tr key={assessment.question_id}>
  <td>{index + 1}</td>
  <td>{assessment.question_text}</td>
  <td>
  <span title="Take Assessment" onClick={() => handleTakeAssessment(assessment.assessment_id)} className="btn btn-info ml-1">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
<path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
</svg>
    </span>
  </td>
</tr>
));


  const viewRemainingPrograms =()=>{
    setIsQuestion("block");
    setIsAttemptQuestion("none");
    setIsCompletedQuestion("none");
    setIsQuestionActive(true);
    setIsAttemptQuestionActive(false);
    setIsCompletedQuestionActive(false);

  }

  
  const viewAttemptedPrograms =()=>{
    setIsQuestion("none");
    setIsAttemptQuestion("block");
    setIsCompletedQuestion("none");
    setIsQuestionActive(false);
    setIsAttemptQuestionActive(true);
    setIsCompletedQuestionActive(false);
  }

  
  const viewRCompletedPrograms =()=>{
    setIsQuestion("none");
    setIsAttemptQuestion("none");
    setIsCompletedQuestion("block");
    setIsQuestionActive(false);
    setIsAttemptQuestionActive(false);
    setIsCompletedQuestionActive(true);
  }

    return (
        <>
          <div className="content">
          <Row md="12" className="justify-content-center">
          <Col lg="3" md="6" sm="6">
          <Card className= { isQuestionActive?"card-stats bg-secondary": "card-stats"} onClick={viewRemainingPrograms} style={{cursor:"pointer"}}>
              <CardBody>
                <Row>
                  <Col md="12">
                    <div className=" text-center text-warning">
                      <h6>Total Programs</h6>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className={ isAttemptQuestionActive?"card-stats bg-secondary": "card-stats"}  onClick={viewAttemptedPrograms} style={{cursor:"pointer"}}>
              <CardBody>
                <Row>
                  <Col md="12">
                    <div className=" text-center text-warning">
                    <h6>Attempted Programs</h6> 
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className={ isCompletedQuestionActive?"card-stats bg-secondary": "card-stats"}onClick={viewRCompletedPrograms} style={{cursor:"pointer"}}>
              <CardBody>
                <Row>
                  <Col md="12" >
                    <div className=" text-center text-warning">
                    <h6>Completed Programs</h6>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Card >
          <CardBody>
    <Row style={{display:isQuestion}}>
        <Col >
         {/* Table */}
         <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Total Program Questions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {QuestiontableRows}
        </tbody>
      </Table>

      {/*QtotalPages ? (
  <Pagination>
    {[...Array(QtotalPages)].map((_, index) => {
      const page = index + 1;
      return (
        <PaginationItem key={page} active={page === QcurrentPage}>
          <PaginationLink onClick={() => handleQPageChange(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    })}
  </Pagination>
) : (
  <p>Loading pagination...</p>
)*/}

        </Col>
    </Row>

    <Row style={{display:isAttemptQuestion}}>
        <Col>
         {/* Table */}
         <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Attempted Program Questions ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {AttempttableRows}
        </tbody>
      </Table>
      {/*AtotalPages ? (
  <Pagination>
    {[...Array(AtotalPages)].map((_, index) => {
      const page = index + 1;
      return (
        <PaginationItem key={page} active={page === AcurrentPage}>
          <PaginationLink onClick={() => handleAPageChange(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    })}
  </Pagination>
) : (
  <p>Attempt Question is Zero...</p>
)*/}

        </Col>
    </Row>

    <Row style={{display:isCompletedQuestion}}>
        <Col>
         {/* Table */}
         <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Date</th>
            <th>Completed Program Questions</th>
            <th>Language</th>
            <th>Mark</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {CompletedtableRows }
        </tbody>
      </Table>
      {/*CtotalPages ? (
  <Pagination>
    {[...Array(CtotalPages)].map((_, index) => {
      const page = index + 1;
      return (
        <PaginationItem key={page} active={page === CcurrentPage}>
          <PaginationLink onClick={() => handleCPageChange(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    })}
  </Pagination>
) : (
  <p>Completed Question is Zero...</p>
)*/}

        </Col>
    </Row>
    </CardBody>
    </Card>
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
                        <label>Time to complete</label>
                        <Input
                          type=""
                          defaultValue=""
                          value={Time_to_complete} 
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
                        <label>Attend Time</label>
                        <Input
                          type=""
                          defaultValue=""
                          value={Attend_time} 
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
              {RunTime && RunTime.length > 0 ? ( 
                RunTime.map((run, index) => (
                <Row key={index}>
                  <Col md="12">
                    <h6>Run time : {index + 1}</h6>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Compiler  Verify</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={typeof run === "string"? JSON.parse(run).compilestatus:run.compilestatus}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Compiler  Verify Mark</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={typeof run === "string"? JSON.parse(run).compileVerifymark:run.compileVerifymark}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Code  Verify</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={typeof run === "string"? JSON.parse(run).codeVerify:run.codeVerify}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Code  Verify Mark </label>
                      <Input
                        type=""
                        defaultValue=""
                        value={typeof run === "string"? JSON.parse(run).codeVerifymark:run.codeVerifymark}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Testcaes Verify</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={typeof run === "string"? JSON.parse(run).testcaseverify:run.testcaseVerify}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Testcaes Verify Mark</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={typeof run === "string"? JSON.parse(run).testcaseVerifymark:run.testcaseVerifymark}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Assessment Attend Mark</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={typeof run === "string"? JSON.parse(run).ifattendassesment:run.ifattendassesment}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Total Mark for this Run Time</label>
                      <Input
                        type=""
                        defaultValue=""
                        value={typeof run === "string"? JSON.parse(run).mark:run.mark}
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
                        value={typeof run === "string"? JSON.parse(run).codelengthcount:run.codelengthcount}
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
                        value={typeof run === "string"? JSON.parse(run).codelettercount:run.codelettercount}
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
                        value={typeof run === "string"? JSON.parse(run).code:run.code}
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
                        value={typeof run === "string"? JSON.parse(run).input:run.input}
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
                        value={typeof run === "string"? JSON.parse(run).output:run.output}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  </Row>
              ))
              ) : (
                <Row >
                <Col md="12">
                  <h6>Run time : { 1}</h6>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label>Compiler  Verify</label>
                    <Input
                      type=""
                      defaultValue=""
                      value={RunTime.compilestatus}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label>Compiler  Verify Mark</label>
                    <Input
                      type=""
                      defaultValue=""
                      value={RunTime.compileVerifymark}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label>Code  Verify</label>
                    <Input
                      type=""
                      defaultValue=""
                      value={RunTime.codeVerify}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label>Code  Verify Mark </label>
                    <Input
                      type=""
                      defaultValue=""
                      value={RunTime.codeVerifymark}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label>Testcaes Verify</label>
                    <Input
                      type=""
                      defaultValue=""
                      value={RunTime.testcaseverify}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label>Testcaes Verify Mark</label>
                    <Input
                      type=""
                      defaultValue=""
                      value={RunTime.testcaseVerifymark}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label>Assessment Attend Mark</label>
                    <Input
                      type=""
                      defaultValue=""
                      value={RunTime.ifattendassesment}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label>Total Mark for this Run Time</label>
                    <Input
                      type=""
                      defaultValue=""
                      value={RunTime.mark}
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
                      value={RunTime.codelengthcount}
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
                      value={RunTime.codelettercount}
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
                      value={RunTime.code}
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
                      value={RunTime.input}
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
                      value={RunTime.output}
                      disabled
                    />
                  </FormGroup>
                </Col>
                </Row>
              )}

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
          </>);
}

export default Assessment;