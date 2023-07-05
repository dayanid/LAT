import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import {Table, Pagination} from 'react-bootstrap';

import { generateApiKey } from '../Api/api';
// reactstrap components
import {Table, Pagination, InputGroupText,InputGroupAddon,InputGroup, Card, CardHeader, CardBody, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup,Form,Input, Alert,
  PaginationItem,
  PaginationLink,} from "reactstrap";

function Tables() {
  const [questions, setQuestions] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddMultiModalOpen, setIsAddMultiModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [testCases, setTestCases] = useState([{ sample_input: '', sample_output: '' }]);
  const [ID, setID] = useState('');
  
  useEffect(() => {
    fetch("http://localhost:9000/listQuestions", {
      headers: {
        apikey: generateApiKey()
      }
    })
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        console.log(data);
      })
      .catch(error => console.error(error));
  }, []);

const QuestionFilter =(Q) =>{
    fetch(`http://localhost:9000/listQuestions?q=${Q}`, {
      headers: {
        apikey: generateApiKey()
      }
    })
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
      })
      .catch(error => console.error(error));
  }
  const handleUpdateQuestion = questionId => {
    const selectedQuestion = questions.data.find(question => question.question_id === questionId);
    setSelectedQuestion(selectedQuestion);
    setID(selectedQuestion.question_id);
    setQuestionText(selectedQuestion.question_text);
    setExplanation(selectedQuestion.explanation);
    setTestCases(JSON.parse(selectedQuestion.test_case)); // Update test cases state
    setIsUpdateModalOpen(true);
    console.log(selectedQuestion);
    
  };

  const handleViewQuestion = questionId => {
    const selectedQuestion = questions.data.find(question => question.question_id === questionId);
    setSelectedQuestion(selectedQuestion);
    setQuestionText(selectedQuestion.question_text);
    setID(selectedQuestion.question_id);
    setExplanation(selectedQuestion.explanation);
    console.log("TestCase :",JSON.parse(selectedQuestion.test_case));
    setTestCases(JSON.parse(selectedQuestion.test_case)); // Update test cases state
    setIsViewModalOpen(true);
    console.log(selectedQuestion);
    
  };
  

  const handleDeleteQuestion = questionId => {
    const selectedQuestion = questions.data.find(question => question.question_id === questionId);
    setSelectedQuestion(selectedQuestion);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedQuestion(null);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
    setIsAddModalOpen(false);
    setIsAddMultiModalOpen(false);
    setExplanation("");
    setQuestionText("");
    setTestCases([{ sample_input: '', sample_output: '' }]);
    setFile("");
  };

  const handleInputChange = (event, index) => {
    const newTestCases = [...testCases];
    newTestCases[index].input = event.target.value;
    setTestCases(newTestCases);
  };

  const handleOutputChange = (event, index) => {
    const newTestCases = [...testCases];
    newTestCases[index].output = event.target.value;
    setTestCases(newTestCases);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      question_text: questionText,
      explanation:explanation,
      test_case: JSON.stringify(testCases.map(testCase => ({ sample_input: testCase.input, sample_output: testCase.output })))
    };
    fetch('http://localhost:9000/addQuestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': generateApiKey()
      },
      body: JSON.stringify(newQuestion)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert('Question added successfully!');
      setQuestionText('');
      setTestCases([{ input: '', output: '' }]);
    })
    .catch(error => {
      console.error(error);
      alert('Failed to add question!');
    });
  };

  const handleUpdate = () => {
    // Logic to handle updating question with the given questionId
    // ...
    const questionData = {
      questionText:questionText,
      explanation: explanation,
      testCases: testCases
    };
  
    fetch(`http://localhost:9000/updateQuestion/${ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "apikey": generateApiKey()
      },
      body: JSON.stringify(questionData)
    })
    .then(response => {
      if (response.ok) {
        console.log("Qustion updated successfully!");
        handleCloseModal(); // Call the function to close the modal
        window.location.reload(); // Uncomment this line to reload the window after update
      } else {
        console.error("Failed to update Question:", response.statusText);
        Alert("Failed to update Question.");
      }
    })
    .catch(error => {
      console.error("Failed to update student:", error);
      Alert("Failed to update student.");
    });
    handleCloseModal();
    window.location.reload();
  };

  const handleDelete = () => {
    // Extract question_id from the selectedQuestion object
    const { question_id } = selectedQuestion;
  
    // Send DELETE request to delete question
    fetch(`http://localhost:9000/deleteQuestion/${question_id}`, {
      method: "DELETE",
      headers: {
        apikey: generateApiKey()
      }
    })
      .then(response => {
        if (response.ok) {
          // Question successfully deleted
          alert("Question deleted successfully!");
          setIsDeleteModalOpen(false);
          window.onload();
          // Update state or perform any other required action
        } else {
          throw new Error("Failed to delete question");
        }
      })
      .catch(error => console.error(error));
  };
  
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

const pageSize = 5; // number of items to display per page

const startIndex = (currentPage - 1) * pageSize;
let endIndex = startIndex + pageSize;
if (endIndex > questions?.data?.length) {
  endIndex = questions?.data?.length;
}
const currentQuestionData = questions?.data?.slice(startIndex, endIndex);



const totalPages = Math.ceil(questions?.data?.length / pageSize);

  const tableRows = currentQuestionData?.map((question, index) => (
    <tr key={question.question_id}>
      <td>{startIndex + index + 1}</td>
      <td>{question.question_text}</td>
      <td>
      <span onClick={() => handleViewQuestion(question.question_id)} className="btn btn-primary ml-1" style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
              </svg>
            </span>
        <span onClick={() => handleUpdateQuestion(question.question_id)} className="btn btn-info ml-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
</svg>
        </span>
        <span onClick={() => handleDeleteQuestion(question.question_id)} className="btn btn-danger ml-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
</svg>
        </span>
      </td>
    </tr>
  ));

  
  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };



  

    const [classes, setClasses] = React.useState("dropdown");
    const handleClick = () => {
      if (classes === "dropdown") {
        setClasses("dropdown show");
      } else {
        setClasses("dropdown");
      }
    };
//------------------------Add Multiple Question ---------------------------------Start
const [dragging, setDragging] = useState(false);
const [file, setFile] = useState(null);
const [fileData, setFileData] = useState("");


function handleDragEnter(e) {
  e.preventDefault();
  setDragging(true);
}

function handleDragLeave(e) {
  e.preventDefault();
  setDragging(false);
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const droppedFile = e.dataTransfer.files[0];
  const allowedTypes = ["application/json", "text/csv"];
  if (allowedTypes.includes(droppedFile.type)) {
    setFile(droppedFile);
    readFile(droppedFile);
    setIsAddMultiModalOpen(true);
    setDragging(false);
  } else {
    alert("Invalid file type. Please upload a JSON or CSV file.");
  }
}

function handleSelectFile(e) {
  const selectedFile = e.target.files[0];
  const allowedTypes = ["application/json", "text/csv"];
  if (allowedTypes.includes(selectedFile.type)) {
    setFile(selectedFile);
    readFile(selectedFile);
  } else {
    alert("Invalid file type. Please upload a JSON or CSV file.");
  }
}

function readFile(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const content = event.target.result;
    if (file.type === "application/json") {
      const jsonData = JSON.parse(content);
      setFileData(jsonData);
      //console.log("Uploading file:", fileData);
    } else if (file.type === "text/csv") {
      // convert CSV data to JSON and print in console
      const jsonData = convertCsvToJson(content);
      setFileData(jsonData);
      

    }
  };
  reader.readAsText(file);
}


function convertCsvToJson(csvData) {
  const lines = csvData.split("\n").filter(line => line.trim() !== ""); // remove empty lines
  const headers = lines[0].split(",");
  if (headers[0] === "question_text" && headers[1] === "explanation" && headers[2] === "test_case" && headers[3] === "keyword"){
      const result = [];
      for (let i = 1; i < lines.length; i++) {
        const row = {};
        const values = lines[i].split(",");
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = values[j].replaceAll("|",","); // replace | with ,
        }
        result.push(row);
      }
      console.log("Uploading file:", result);
      return result;
    }
    else{
      alert("Import File templete is Not match");
      setFile(null);
    }
}




function handleSubmit(e) {
  e.preventDefault();
  // You can use the "file" state variable here to upload the file to your server
  console.log("Uploading file:", file);
}

function handleUploadClick() {
  // You can use the "file" state variable here to upload the file to your server
  const newQuestion = {
    data: fileData
  };
  fetch('http://localhost:9000/addMultiQuestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': generateApiKey()
    },
    body: JSON.stringify(newQuestion)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
   
    if(data.status === true){
      alert('Added  multi Questionsuccessfully!');
    }else{
      alert("Some of the Questions already exist.");

    }
  })
  .catch(error => {
    console.error(error);
    alert('Failed to add multi question!');
  });
  console.log("Uploading file:", fileData);
  setIsAddMultiModalOpen(false);
}

//------------------------Add Multiple Question ---------------------------------End

//------------------------Export Question ---------------------------------Start
function downloadCsv() {
  const fileName = prompt("Enter File Name,without Extension (.csv)", "");
  if(fileName != null){
    const data = questions.data;
    const headers = "question_id,question_text,explanation,test_case,keyword,created_at,created_by,updated_at,updated_by"; // defining the headers of the CSV file
    var String = ""
    for (var i=0;i<data.length;i++){
      // building the string row by row with values separated by commas
      String = String + `\n ${data[i].question_id},${data[i].question_text.replaceAll(",", "")},${data[i].explanation.replaceAll(",", '')},${data[i].test_case.replaceAll(",", '|')},${data[i].keyword.replaceAll(",", "|")},${data[i].created_at},${data[i].created_by},${data[i].update_at},${data[i].update_by}`
    }
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" +String; // combining headers and data to form CSV content
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click(); // triggering the download
    document.body.removeChild(link);
  } 
}
//------------------------Export Question ---------------------------------End
 return (
    <>
      <div className="content" 
       onDragEnter={handleDragEnter}
       onDragLeave={handleDragLeave}
       onDragOver={handleDragOver}
       onDrop={handleDrop}
      >
      <Row>
      <Col md="12">
        
        <Card>
          <CardBody>
            <CardHeader>
              <Row md="12">
              <Col md="10" >
              <div className=" text-primary">
              <h5>
            <i className="nc-icon nc-simple-add mx-2" 
            onClick={() =>  handleClick()}
            style={{ cursor: 'pointer' }} ></i>
              </h5>    
        <div className={classes +" bg-dark"} style={{marginRight:"0%"}}>
        <ul className="dropdown-menu show">
          <li className="button-container">
            <Button
              color="primary"
              block
              className="btn-round"
              onClick={() =>  setIsAddModalOpen(true)}>
              <i className="nc-icon nc-simple-add mx-2" ></i>
              Add single Question
            </Button>
          </li>
          <li className="button-container">
            <Button
              color="danger"
              block
              className="btn-round"
              target="_blank"
              onClick={() =>  setIsAddMultiModalOpen(true)}> 
              <i className="nc-icon nc-simple-add mx-2" > </i>
             Add Multi Question
            </Button>
          </li>
        </ul>
      </div>
      </div>
              </Col>
      
      <Col md="2">
      <div className="button-container " style={{maxWidth:"155px"}}>
      <Button
              color="danger"
              block
              className="btn-round"
              target="_blank"
              onClick={() =>  downloadCsv()}> 
            Export
            </Button>
            </div>
      </Col>
      <Col md="12">
  <InputGroup className="">
    <Input
      placeholder="Search..."
      onChange={e => QuestionFilter(e.target.value)} 
    />
    <InputGroupAddon addonType="append">
      <InputGroupText>
        <i className="nc-icon nc-zoom-split" />
      </InputGroupText>
    </InputGroupAddon>
  </InputGroup>
      </Col>
      </Row>
  </CardHeader>
            {/* Table */}
            <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Question Text</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </Table>
      {totalPages ? (
  <Pagination>
    {[...Array(totalPages)].map((_, index) => {
      const page = index + 1;
      return (
        <PaginationItem key={page} active={page === currentPage}>
          <PaginationLink onClick={() => handlePageChange(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    })}
  </Pagination>
) : (
  <p>Loading pagination...</p>
)}

          </CardBody>
        </Card>
      </Col>
    </Row>
      </div>

    {/* view Question Modal */}
    <Modal isOpen={isViewModalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>View Question</ModalHeader>
        <ModalBody>
          {/* Render View question form */}
          {selectedQuestion && (
            <div>
              <Form>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                         <label><b>Question</b></label>
                        <p>
                          {questionText}
                       </p>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <label><b>Explanation</b></label>
                        <p>
                          {explanation}
                       </p>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div>
                  <h6 className="text-center text-secondary">
                        Testcase
                      </h6>                   
                    </div>

                    {Array.isArray(testCases) && testCases.map((testCase, index) => (
        <div key={index} className="mb-3">
           <Row>
                    <Col md="6">
                      <FormGroup>
                      <label><b>Input:</b></label>
                      <Input
                          type="textarea"
                          defaultValue=""
                          value={testCase.sample_input} 
                        />
                      </FormGroup>
                      
                    </Col>
                    <Col md="6">
                      <FormGroup>
                  
                         <label><b>Output:</b></label>
                         <Input
                          type="textarea"
                          defaultValue=""
                          value={testCase.sample_output} 
                        />
                      </FormGroup>
                    </Col>
                   
                  </Row>
        </div>
      ))}             
                </Form>
            </div>
          )}
        </ModalBody>
      </Modal>


      {/* Add Student Modal */}
      <Modal isOpen={isAddModalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}><h6 className=" text-primary">Add Question</h6></ModalHeader>
        <ModalBody>
        <div>
              <Form>
              <Row>
            <Col md="12">
            <Card className="">
              <CardBody>
                <Form>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label><b>Question</b></label>
                        <Input
                          type="textarea"
                          defaultValue=""
                          value={questionText} 
                          onChange={(event) => setQuestionText(event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <label><b>Explanation</b></label>
                        <Input
                          type="textarea"
                          defaultValue=""
                          value={explanation} 
                          onChange={(event) => setExplanation(event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  
                  {testCases.map((testcase, index) => (
                  <div key={index} className="mb-3">
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label><b>Input :{" "}{index}</b></label>
                        <Input
                          type="textarea"
                          defaultValue=""
                          value={testcase.input} 
                          onChange={(event) => handleInputChange(event, index)} 
                        />
                      </FormGroup>
                      
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label><b>Output :{" "}{index}</b></label>
                        <Input
                          type="textarea"
                          defaultValue=""
                          value={testcase.output} 
                          onChange={(event) => handleOutputChange(event, index)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  </div>
                  ))}
                  <div>
                    <h6 className="text-center text-secondary">
                    <Button
                        className="btn-round"
                        color="primary"
                        onClick={addTestCase}
                      >
                        Add Testcase
                      </Button>
                      </h6>
                    </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
                </Form>
            </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleAddQuestion}>
            Add
          </Button>{" "}
          <Button color="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Update Question Modal */}
      <Modal isOpen={isUpdateModalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>Update Question</ModalHeader>
        <ModalBody>
          {/* Render update question form */}
          {selectedQuestion && (
            <div>
              <Form>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                      <label><b>Question</b></label>
                        <Input
                          type="textarea"
                          defaultValue=""
                          value={questionText} 
                          onChange={(event) => setQuestionText(event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                      <label><b>Explanation</b></label>
                      <Input
                        rows={4}
                        className="form-contrl"
                          type="textarea"
                          defaultValue=""
                          value={explanation} 
                          onChange={(event) => setExplanation(event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div>
                    <h6 className="text-center text-secondary">
                        Add Testcase
                      </h6>                   
                    </div>

                    {Array.isArray(testCases) && testCases.map((testCase, index) => (
        <div key={index} className="mb-3">
           <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Input</label>
                        <Input
                          type="textarea"
                          defaultValue=""
                          value={testCase.sample_input} 
                          onChange={(event) => handleInputChange(event, index)} 
                        />
                      </FormGroup>
                     {console.log("Input :" ,testCase.input)} 
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Output</label>
                        <Input
                          type="textarea"
                          defaultValue=""
                          value={testCase.sample_output} 
                         onChange={(event) => handleOutputChange(event, index)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              ))}             
                </Form>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>
            Update
          </Button>{" "}
          <Button color="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Question Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>Delete Question</ModalHeader>
        <ModalBody>
          {/* Render delete question confirmation */}
          {selectedQuestion && (
            <div>
              <p>Are you sure you want to delete the following Question?</p>
              <p>Question : {selectedQuestion.question_text}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            Delete
          </Button>{" "}
          <Button color="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

       {/* Add Multi Question Modal */}
       <Modal isOpen={isAddMultiModalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>Add Multiple Question</ModalHeader>
        <ModalBody>
        <div className="container-fluid" style={{ height: "400px" } }
       onDragEnter={handleDragEnter}
       onDragLeave={handleDragLeave}
       onDragOver={handleDragOver}
       onDrop={handleDrop}
        >
        <div className="row justify-content-center align-items-center h-100">
        <p>
                Drag and drop a JSON or CSV file anywhere on this box to upload
              </p>
        <div
          className="col-sm-8 col-md-6 col-lg-4 bg-light rounded border p-3">
          
          {file ? (
            <div>
              <p>Selected file: {file.name}</p>
              <button className="btn btn-primary" onClick={handleUploadClick}>
                Upload
              </button>
            </div>
          ) : (
            <div>
              <div className="custom-file ">
                <input
                  type="file"
                  className="custom-file-input"
                  id="fileInput"
                  onChange={handleSelectFile}
                />
                <label className="custom-file-label" htmlFor="fileInput">
                  Choose file
                </label>
              </div>
            </div>
          )}
          {dragging && (
            <div className="drag-overlay">
              <p>Drop file to upload</p>
            </div>
          )}
        </div>
        
      </div>
      </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Tables;
