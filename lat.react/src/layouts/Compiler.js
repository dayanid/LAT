
import React, {useRef, useEffect, useState } from "react";
import { useLocation , useHistory } from 'react-router-dom';
import NotificationAlert from 'react-notification-alert';
import { generateApiKey } from '../Api/api';
// reactstrap components
import { Card, CardHeader,CardFooter, CardBody, CardTitle,  Row, Col, Modal,  Button, FormGroup,Form,Input} from "reactstrap";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-chrome";

const notify = (notificationAlertRef, place, type ,  message) => {
  if (notificationAlertRef && notificationAlertRef.current) {
    var color = Math.floor(Math.random() * 5 + 1);
    var options = {
      place: place,
       message: (
        <div>
         {  message}
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 3
    };
    notificationAlertRef.current.notificationAlert(options);
  } else {
    console.error('notificationAlertRef is not properly defined or initialized');
  }
};

function Compiler() {

  const location = useLocation();
  const history = useHistory();
  const { state } = location;
  const [QID, setQID] = useState(null);
  const notificationAlertRef = React.useRef();
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(">");
  const [runTime, setRunTime] = useState(0);
  const [dataArray, setDataArray] = useState([]);
  const [lang, setLang] = useState("");
  const [editor, setEditor] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [testCases, setTestCases] = useState([{ sample_input: '', sample_output: '' }]);
  const [showTestcase, setShowTestcase] = useState("none");
  const [showOutput, setShowOutput] = useState("");
  const [codeVerify,setCodeVerify] = useState(false);
  const [testcaseVerify,testcaseCodeVerify] = useState(true);
  const [randominput,setRandominput] = useState("");
  const [testcaseMessage,setTestcaseMessage] = useState(null);
  const [isFullscreen, setIsFullscreen] = React.useState(true);
  const [showDiv, setShowDiv] = useState(false);
  const [checktestcase, setCheckTestCase] = useState(false);
  const [height, setHeight] = useState('50%');
  const [data, setData] = useState("");
  const [userdata, setUserdata] = useState("");
  const [time, setTime] = useState('00:00:00');
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isTimeRunning, setIsTimeRunning] = useState(false);

  const fetchData = async () => {
    try {
      sessionStorage.removeItem("dataArray");
        const secondResponse = await fetch(`http://localhost:9000/getStudentByEmail/${state.studentEmail}`, {
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
        }

        await fetch(`http://localhost:9000/getQuestion/${state.questionId}`, {
          headers: {
            apikey: generateApiKey()
          }
        })
          .then(response => response.json())
          .then(data => {
            setQuestions(data.data);
            setTestCases(JSON.parse(data.data.test_case));
            //console.log(JSON.parse(data.data.test_case));
            //console.log("random input:\n",randominput);
          const randomIndex = Math.floor(Math.random() * testCases.length);
          //console.log( randomIndex )
          setRandominput(testCases[randomIndex].sample_input);
          //console.log(testCases[randomIndex].sample_input);
          })
          .catch(error => console.error(error));
    } catch (error) {
      console.error("Student:", error);
    }

  }

  useEffect(() => {
      if (state === undefined) {
        history.push({pathname: '/student/assessment' });
      }else{
        fetchData();
      }
  }, []);

  useEffect(() => {
    let intervalId;
    if (isTimeRunning) {
      intervalId = setInterval(() => {
        if (seconds === 59) {
          setSeconds(0);
          setMinutes(prevMinutes => prevMinutes + 1);
        } else {
          setSeconds(prevSeconds => prevSeconds + 1);
        }

        if (minutes === 59 && seconds === 59) {
          setMinutes(0);
          setHours(prevHours => prevHours + 1);
        }

        setTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [seconds, minutes, hours, isTimeRunning]);

  const handleStartStopClick = () => {
    setIsTimeRunning(prevIsRunning => !prevIsRunning);
  };

  





  function handleOutputClick() {
    setShowTestcase("none");
    setShowOutput("block")
  }

  function handleTestcaseClick() {
    setShowTestcase("block");
    setShowOutput("none");
  }

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|tablet|ip(ad|hone|od)|android|windows (phone|ce)|iemobile|opera mini/i.test(userAgent);
    if (isMobile) {
      alert("This page is not available on mobile devices. Please access this page from a laptop or computer.");
      window.location.href = "/student";
    }
  }, []);

  useEffect(() => {
   
  }, []);



  useEffect(() => {
    const ace = require("ace-builds/src-noconflict/ace");
    require("ace-builds/src-noconflict/mode-java");
    require("ace-builds/src-noconflict/mode-python");
    require("ace-builds/src-noconflict/mode-c_cpp");
    require("ace-builds/src-noconflict/mode-csharp");
    require("ace-builds/src-noconflict/mode-javascript");
    require("ace-builds/src-noconflict/theme-ambiance");
    require("ace-builds/src-noconflict/theme-chaos");
    require("ace-builds/src-noconflict/theme-chrome");
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setWrapLimitRange(80, 80);
    editor.setFontSize(16); // Set the font size to 16 pixels
    // You can adjust the value (e.g., 14, 18) as needed
    editor.getSession().on("change", () => {
      setCode(editor.getSession().getValue());
    });
    setEditor(editor);

    
    const languageSelect = document.getElementById("language-select");
    const themeSelect = document.getElementById("theme-select");
    languageSelect.addEventListener("change", (event) => {
      const value = event.target.value;
      setLang(value);
      if (value === "java") {
        editor.getSession().setMode("ace/mode/java");
        editor.setValue("public class main {\npublic static void main(String[] args) {\n\n}\n}");
      } else if (value === "python") {
        editor.getSession().setMode("ace/mode/python");
        editor.setValue("");
      } else if (value === "c") {
        editor.getSession().setMode("ace/mode/c_cpp");     
        editor.setValue("#include <stdio.h>\n\nint main() {\n      \n  return 0;\n}");
      } else if (value === "cpp") {
        editor.getSession().setMode("ace/mode/c_cpp");
        editor.setValue("#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}");
      } else if (value === "csharp") {
        editor.getSession().setMode("ace/mode/csharp"); 
        editor.setValue("#include <iostream>\n\nint main() {\n    \n    return 0;\n}");
      } else {
        editor.getSession().setMode("ace/mode/javascript");
      }
    });

    themeSelect.addEventListener("change", (event) => {
      const value = event.target.value;
      editor.setTheme(value);
    });

    editor.commands.addCommand({
      name: "myCommand",
      bindKey: {win: "Ctrl-V", mac: "Command-V"},
      exec: function(editor) {
        // Prevent the default paste behavior
        editor.onPaste = "*No No No*";
        notify(notificationAlertRef, "tc", "warning", "Paste Function is not allowed");
      }
    });
  }, []);
  
  const editorStyle = {
    width: '100%',
    height: '650px',
    buttom:0,
  };


  const divRef = useRef(null);
  const buttonRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  

  const handleFullScreen= () => {
    handleStartStopClick();
    if (divRef.current) {
      if (document.fullscreenElement === divRef.current) {
        document.exitFullscreen();
      } else {
        divRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleExitFullScreen = () => {
      if (document.fullscreenElement === null) {
        console.log('Full screen mode exited.');
        history.push({pathname: '/student/assessment' });
        // Perform any necessary actions when the user exits full-screen mode
      }
    };
    document.addEventListener('fullscreenchange', handleExitFullScreen);
    return () => {
      document.removeEventListener('fullscreenchange', handleExitFullScreen);
    };
  }, []);

  useEffect(() => {
    setShowModal(true);
  }, []);


  const handleClose = () => {
    setShowModal(false);
    history.push({pathname: '/student/assessment' });
  };
  



  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const maxHeight = window.innerHeight * 0.9;
    const minHeight = window.innerHeight * 0.1;
    const newHeight = Math.min(maxHeight, Math.max(minHeight, window.innerHeight - e.clientY));
    setHeight(`${newHeight}px`);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleRunClick = async() => {
    // Check if a language has been selected
    if (lang !== "") {
      setRunTime(runTime + 1);
      setTestcaseMessage("");
      // Select a random test case
      const randomIndex = Math.floor(Math.random() * testCases.length);
      const selectedTestCase = testCases[randomIndex];
  
      // Update state to show the input and output areas
      setRandominput(selectedTestCase.sample_input);
      setShowDiv(true);
      setOutput("Compiling . . .");
  
      // Send a POST request to the Codex API
      await fetch("https://api.codex.jaagrav.in/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang === "python" ? "py" : lang === "csharp"? "cs" : lang,
          code: code,
          input: selectedTestCase.sample_input,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Update state to show the output
          setInput(selectedTestCase.sample_input);
          if (data.output !== "") {
            setOutput(data.output);
              if (selectedTestCase.sample_input !== ""){
          // Send a POST request to the server to check the test case
          fetch("http://localhost:9000/Checktestcase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: generateApiKey()
            },
            body: JSON.stringify({
              student_email :userdata.student_email,
              question_id: state.questionId,
              question_text:questions.question_text,
              language: lang,
              code: code,
              input: selectedTestCase.sample_input,
              output: data.output.includes("\n")?data.output.replace(/\n/g, ""):data.output,
              compilestatus:true,
              runtime :runTime +1
            })
          })
          .then((res) => res.json())
              .then((data) => {
                // Check if the test case passed or failed
                if (data.status === true) {
                  setCodeVerify(true);
                  setCheckTestCase(true);
                   setTestcaseMessage(` 🗸  Testcase No. ${data.result.testcaseno} is Pass`);
                } else {
                  setCodeVerify(false);
                  setCheckTestCase(false);
                  setTestcaseMessage(data.result.codeVerify? "✗ code verification is true but Test cases fail" : "✗ code is not satisfied to conditions");
                }                
              })
              .catch((err) => {
                console.error(err);
              });
              }else{
          // Send a POST request to the server to check the test case
          fetch("http://localhost:9000/Checktestcase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: generateApiKey()
            },
            body: JSON.stringify({
              student_email :userdata.student_email,
              question_id: state.questionId,
              question_text:questions.question_text,
              language: lang,
              code: code, 
              output: data.output.replace(/\n$/, ""),
              compilestatus:true,
              runtime :runTime +1
            })
          })
          .then((res) => res.json())
              .then((data) => {
                // Check if the test case passed or failed
                if (data.status === true) {
                  setCodeVerify(true);
                  setCheckTestCase(true);
                  setTestcaseMessage(` 🗸  Testcase No. ${data.result.testcaseno} is Pass`);
                } else {
                  setCheckTestCase(false);
                  setCodeVerify(false);
                  setTestcaseMessage(data.result.codeVerify?"✗ code verification is true but Test cases fail" :"✗ code is not satisfied to conditions")
                }                
              })
              .catch((err) => {
                console.error(err);
              });
              }
          } else {
            setOutput(data.error);
             if (selectedTestCase.sample_input !== ""){
             fetch("http://localhost:9000/Checktestcase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: generateApiKey()
            },
            body: JSON.stringify({
              student_email :userdata.student_email,
              question_id: state.questionId,
              question_text:questions.question_text,
              language: lang,
              code: code,
              input: selectedTestCase.sample_input,
              output: data.error,
              compilestatus:false,
              runtime :runTime +1
            })
          })
          .then((res) => res.json())
              .then((data) => {
                // Check if the test case passed or failed
                if (data.status === true) {
                  setCodeVerify(false);
                  setCheckTestCase(false);
                   setTestcaseMessage("✗ Runtime Error Occur But your Code Verification is Pass");
                } else {
                  setCodeVerify(false);
                  setCheckTestCase(false);
                  setTestcaseMessage("✗  Runtime Error Occur And Also code is not satisfied to conditions");
                }                
              })
              .catch((err) => {
                console.error(err);
              });
            }
           else{
            fetch("http://localhost:9000/Checktestcase", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: generateApiKey()
              },
              body: JSON.stringify({ 
                student_email :userdata.student_email,
                question_id: state.questionId,
                question_text:questions.question_text,
                language: lang,
                code: code,
                output: data.error,
                compilestatus:false,
                runtime :runTime + 1
              })
            })
            .then((res) => res.json())
                .then((data) => {
                  // Check if the test case passed or failed
                  if (data.status === true) {
                    setCodeVerify(false);
                    setCheckTestCase(false);
                     setTestcaseMessage("✗ Runtime Error Occur.");
                  } else {
                    setCodeVerify(false);
                    setCheckTestCase(false);
                    setTestcaseMessage("✗  Runtime Error Occur.");
                  }                
                })
                .catch((err) => {
                  console.error(err);
                });
           }
          }
  })
        .catch((err) => {
          console.error(err);
        });
          } else {
            notify(notificationAlertRef, "tc", "info", "Select a language!");
          }              
  };

  const [isChecked, setIsChecked] = useState(false);
  const handleSubmitClick = async() => {
    console.log({
      student_email :userdata.student_email,
      question_id: state.questionId,
      time_to_complete:time
    });
    if (runTime !== 0){
    fetch("http://localhost:9000/AssessmentSubmit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: generateApiKey()
      },
      body: JSON.stringify({ 
        student_email :userdata.student_email,
        question_id: state.questionId,
        time_to_complete:time
      })
    })
    .then((res) => res.json())
        .then((data) => {
          // Check if the test case passed or failed
          if (data.status === true) {
             notify(notificationAlertRef, "tc", "success", "Assessment is Submitted");
             history.push({pathname: '/student/assessment' });
          } else { 
            notify(notificationAlertRef, "tc", "danger", "Assessment is Not Submitted ");
          }                
        })
        .catch((err) => {
          console.error(err);
        });
        
      }else{
        notify(notificationAlertRef, "tc", "warning", "Assessment is Not Submitted.");
      }
    
  }



  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  


  return (
    <div className="bg-white">
    <div ref={divRef} className="bg-white">
      <Row className="bg-white" style={{width:"100%",height:"100%",top:0,right:0,left:0,bottom:0}}>
      <div>
        <NotificationAlert ref={notificationAlertRef} />
    </div>
      <Col md="4" className="bg-white" >
        <div className="col-md-4" style={{position:"fixed",top:0,left:0,bottom:0,width:"100%",height:"100%",overflow:"auto"}}>
        <Card>
        <Form>
                  <Row>
                    <Col md="12">
                      <CardHeader >
                          <CardTitle className="text-success text-center">
                            <h6><i className="nc-icon nc-single-02" />{ " "+userdata.student_name+ `(${userdata.student_registerno})`}</h6>
                          </CardTitle>
                      <FormGroup>
                      <b>Question</b><br/>
                       
                        <p>
                          {questions.question_text}
                       </p>
                       
                      </FormGroup>
                      </CardHeader>
                    </Col>
                    <CardBody>
                    <Col md="12">
                      <FormGroup>
                       <b>Explanation</b><br/>
                        <p>
                          {questions.explanation}
                       </p>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                    <div>
                  <h6 className="text-center text-secondary">
                        Testcase's
                      </h6>                   
                    </div>
                     <Col>
                     {Array.isArray(testCases) && testCases.map((testCase, index) => (
        <div key={index} className="mb-3">
           <Row><h6>Testcase-  <b>{index}</b></h6>

                    <Col md="12">
                      <FormGroup>
                      <label><b>Input:</b></label>
                       <Input
                          type="textarea"
                          defaultValue=""
                          value={testCase.sample_input} 
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                         <label><b>Expected_Output:</b></label>
                       <Input
                          value={testCase.sample_output} 
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>
        </div>
      ))}   
                     </Col>
                    </Col>
                    </CardBody>
                  </Row>
                </Form>
          </Card>
          </div>
        </Col>
        <Col md="8" >
        <Card>
            <CardHeader>
              <CardTitle>
                <Row>
                <Col md="3">
                <div>
                    <Button color="light" disabled><b>{time}</b></Button>
                </div>
                </Col>
                <Col md="9" className="text-right" >
                <select
                  className="btn btn-info mx-2"
                  id="language-select"
                  defaultValue="">
                  <option value="">Select Language</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                </select>
                
                <select
                  className="btn btn-warning mx-2"
                  id="theme-select">
                  <option value="ace/theme/chrome">Default theme</option>
                  <option value="ace/theme/ambiance">Ambiance</option>
                  <option value="ace/theme/chaos">Chaos</option>
                </select>
                
                <Button  className=" mx-2" color="primary" onClick={handleRunClick} ref={buttonRef}> <i className="nc-icon nc-settings-gear-65" />Execute</Button>
                <Button  className=" mx-2" color="success" onClick={handleSubmitClick} ref={buttonRef} disabled={!isChecked}><i className="nc-icon nc-spaceship" />Submit</Button>
                <label>
  <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
   <b> 🗸 I Confirm my intent to submit my assessment.</b>
</label>

                </Col>
                </Row>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <pre class="text-secondary">Number of letters: <span>{code.length}</span>      Number of lines: <span id="line-count">{code.split("\n").length}</span></pre>
              <div id="editor" style={editorStyle} ></div>
              <p><b>Note: </b> Input is randomly allocated in Runtime.</p>
            </CardBody>
            <CardFooter>
              <div > 
              <div className={`bottom-to-top bg-dark ${showDiv ? 'show' : ''}`} style={{ height }}>
              <div className="resizer bg-dark" onMouseDown={handleMouseDown}><button type="button" className="close text-dark" style={{marginTop:"-30px"}} onClick={e => setShowDiv(!showDiv)}><span ><h3 className="text-dark">{showDiv? "×":"+"}</h3></span></button></div>
              <Row>
  <Col md="12">
    <h3 style={{ textAlign: "center" }} className={checktestcase ? "text-center text-success" : "text-center text-danger"}>{testcaseMessage}</h3>
  </Col>
</Row>
<div style={{ display: showOutput }}>
  <Row>
    <Col md="3" className="ml-3">
      <h6 className="text-success">Random Input:</h6>
      <Input
        type="textarea"
        value={randominput}
        disabled
      />
    </Col>
    <Col md="8">
      <h6 className={codeVerify ? "text-success" : "text-danger"}>Your Output:</h6>
      <textarea
        id="output-area"
        className="bg-secondary text-light"
        style={{
          height: '350px',
          width: '100%',
          border: '1px solid black',
          borderRadius: '5px',
          resize: 'vertical'
        }}
        readOnly
        value={output}
      />
    </Col>
  </Row>
</div>

        <textarea
          id="testcase-field"
          className="bg-secondary text-light"
          style={{ height: '350px', width: '100%', display: showTestcase}}
          value={"hello"}
        />
              </div>
              </div>
      <style jsx>{`
        .bottom-to-top {
          position: fixed;
          bottom: -50%;
          left: 0;
          width: 100%;
          height: 50%;
          z-index: 9999;
          transition: bottom 0.3s ease;
        }
        .bottom-to-top.show {
          bottom: 0;
        }
        .resizer {
          width: 100%;
          height: 10px;
          cursor: ns-resize;
          border-top: 1px solid #000;
         border-bottom: 1px solid #000;
        }
      `}</style>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
    <div className="d-flex justify-content-center align-items-center">
      <Modal isOpen={showModal} centered>
        <div className="modal-header">
          <h5 className="modal-title">Note</h5>
          <button type="button" className="close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
        <ul>
            <li>This assessment will be conducted in full-screen mode. Please select the option below to enable this mode if you are ready to take the assessment.</li>
            <li>If you exit the assessment page while it's open in full-screen mode, your attempt will be logged.</li>
            <li>If you choose to cancel, the assessment page will not load.</li>
        </ul>

        </div>
        <div className="modal-footer">
          <Button color="secondary" onClick={handleClose}>Close</Button>
          <Button color="primary" onClick={handleFullScreen} ref={buttonRef}>Accept</Button>
        </div>
      </Modal>
    </div>
  </div>
  );
  
  
}

export default Compiler;

