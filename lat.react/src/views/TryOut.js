
import React, { useEffect, useState , useRef} from "react";
import "../assets/css/spinner.css";

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
import ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-chrome";

function TryOut() {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [runTime, setRunTime] = useState(0);
  const [dataArray, setDataArray] = useState([]);
  const [lang, setLang] = useState("");
  const [editor, setEditor] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const ace = require("ace-builds/src-noconflict/ace");
    require("ace-builds/src-noconflict/mode-java");
    require("ace-builds/src-noconflict/mode-python");
    require("ace-builds/src-noconflict/mode-c_cpp");
    require("ace-builds/src-noconflict/mode-csharp");
    require("ace-builds/src-noconflict/theme-ambiance");
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
      } else if (value === "python") {
        editor.getSession().setMode("ace/mode/python");
      } else if (value === "c") {
        editor.getSession().setMode("ace/mode/c_cpp");
      } else if (value === "cpp") {
        editor.getSession().setMode("ace/mode/c_cpp");
      } else if (value === "csharp") {
        editor.getSession().setMode("ace/mode/csharp");
      }
    });
    themeSelect.addEventListener("change", (event) => {
      const value = event.target.value;
      editor.setTheme(value);
    });
   
    
    
  }, []);
  
  const handleRunClick = () => {
    if (lang !== "") {
      setOutput("Compiling . . .");
      fetch("https://api.codex.jaagrav.in/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang === "python"? "py":lang,
          code: code,
          input: input,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.output !== "") {
            setOutput(data.output);
          } else {
            setOutput(data.error);
          }
          const codeLength = code.split("\n").length;
          const codeValueCount = code.length;
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      alert("Select a language!");
    }
  };


  
  const editorStyle = {
    width: '100%',
    height: '500px'
  };


  
  return (
    <>
      <div className="content">
        <Row >
          <Col md="8">
            <Card >
            <CardHeader>
            <CardTitle>
  <select
    className="btn btn-info"
    id="language-select"
    defaultValue=""
  >
    <option value="">Select Language</option>
    <option value="java">Java</option>
    <option value="python">Python</option>
    <option value="c">C</option>
    <option value="cpp">C++</option>
    <option value="csharp">C#</option>
    {/* Add more language options here */}
  </select>
  <select
    className="btn btn-white"
    id="theme-select"
  >
  <option value="ace/theme/chrome">light Theme</option>
    <option value="ace/theme/ambiance">Dark Theme</option>
    {/* Add more theme options here */}
  </select>
</CardTitle>

              </CardHeader>
              <CardBody>
              <div id="editor" style={editorStyle} ref={editorRef}></div>
              </CardBody>
              
            </Card>
            
          </Col>
          <Col md="4">
            <Card>
              <Col>
              <CardHeader>
                <CardTitle tag="h6">Input:</CardTitle>
              </CardHeader>
              <CardBody>
              <textarea
                id="input-area"
                className="form-control  bg-light text-secondary"
                style={{ height: "100%" }}
                value={input}
                onChange={(e) => {setInput(e.target.value)}}
              />
              </CardBody>
              </Col>
              <Col>
              <CardHeader>
                <CardTitle tag="h6">Output:
                      <Button
                        className="btn-round btn-primary mx-5"
                        color="primary"
                      
                        type="submit"
                        onClick={handleRunClick}
                      >
                        Run
                      </Button>
                  
                </CardTitle>
              </CardHeader>
              <CardBody >
  
      <textarea
        id="output-area"
        className="bg-secondary text-light"
        style={{ height: '350px',width: '100%', display: 'block' }}
        readOnly
        value={output}
      />
    
</CardBody>
              </Col>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default TryOut;

