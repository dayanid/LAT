import React, { useState } from 'react';

import { generateApiKey } from '../Api/api';
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

  function AddQuestion() {
   

  const [questionText, setQuestionText] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);

  const handleAddQuestion = () => {
    const newQuestion = {
      question_text: questionText,
      explanation:expalanation,
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

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };


    return (
        <>
          <div className="content">
            <Row>
            <Col md="12">
            <Card className="card-user">
              <CardBody>
                <Form>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Question</label>
                        <Input
                          type="textarea"
                          defaultValue=""
                          value={questionText} 
                          onChange={(event) => setQuestionText(event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
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
                  
                  {testCases.map((testcase, index) => (
                  <div key={index} className="mb-3">
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Input</label>
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
                        <label>Output</label>
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
                 
                  <Row>

                    <div className="ml-auto mr-auto">
                      <Button
                        className="btn-round"
                        color="success"
                        onClick={handleAddQuestion}
                      >
                        Submit
                      </Button>
                    </div>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );

  }
  
export default AddQuestion;
