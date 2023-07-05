import React, { useState, useEffect } from "react";
// reactstrap components
import {InputGroupText,InputGroupAddon,InputGroup,Label, Card, CardHeader, CardBody, Table, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup,Form,Input, Alert ,Pagination,PaginationItem,
  PaginationLink,} from "reactstrap";

  import { generateApiKey } from '../Api/api';
function ListStudents() {
    const [Studentsdata, setStudentsdata] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [Name, setName] = useState("");
    const [Mobile, setMobile] = useState("");
    const [RegisterNo, setRegisterNo] = useState("");
    const [PassoutYear, setPassoutYear] = useState("");
    const [Email, setEmail] = useState("");
    const [Gender, setGender] = useState("");
    const [Graduation, setGraduation] = useState("");
    const [Department, setDepartment] = useState("");
    const [Profilepath, setProfilepath] = useState('');
    const [ID, setID] = useState('');

   

    useEffect(() => {
        fetch("http://localhost:9000/listStudents", {
          headers: {
            apikey: generateApiKey()
          }
        })
          .then(response => response.json())
          .then(data => {
            setStudentsdata(data);
          })
          .catch(error => console.error(error));
      }, []);

  const handleUpdateStudent = studentId => {
    const selectedStudent = Studentsdata.data.find(Studentsdata => Studentsdata.student_id === studentId);
    setSelectedStudent(selectedStudent);
    setID(selectedStudent.student_id);
    setName(selectedStudent.student_name);
    setEmail(selectedStudent.student_email); 
    setMobile(selectedStudent.student_mobile);
    setRegisterNo(selectedStudent.student_registerno);
    setPassoutYear(selectedStudent.student_passout); 
    setGender(selectedStudent.student_gender);
    setDepartment(selectedStudent.student_department);
    setGraduation(selectedStudent.student_graduation); 
    setProfilepath("");
    setIsUpdateModalOpen(true);   
  };

  const handleViewStudent = studentId => {
    const selectedStudent = Studentsdata.data.find(Studentsdata => Studentsdata.student_id === studentId);
    setSelectedStudent(selectedStudent);
    setID(selectedStudent.student_id);
    setName(selectedStudent.student_name);
    setEmail(selectedStudent.student_email); 
    setMobile(selectedStudent.student_mobile);
    setRegisterNo(selectedStudent.student_registerno);
    setPassoutYear(selectedStudent.student_passout); 
    setGender(selectedStudent.student_gender);
    setDepartment(selectedStudent.student_department);
    setGraduation(selectedStudent.student_graduation);
    setProfilepath(selectedStudent.student_profile);
    setIsViewModalOpen(true);
   
  };
  

  const handleDeleteStudent = studentId => {
    const selectedStudent = Studentsdata.data.find(Studentsdata => Studentsdata.student_id === studentId);
    setSelectedStudent(selectedStudent);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
    setIsAddModalOpen(false);
    setName("");
    setEmail("");
    setName("");
    setEmail(""); 
    setMobile("");
    setRegisterNo("");
    setPassoutYear(""); 
    setGender("");
    setDepartment("");
    setGraduation("");
    setProfilepath("");
  };

/*
  const handleAddStudent = () => {
    const newStudent = {
      student_name: Name,
      student_email: Email
    };
    fetch('http://localhost:9000/addStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': generateApiKey()
      },
      body: JSON.stringify(newStudent)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert('Student added successfully!');
    })
    .catch(error => {
      console.error(error);
      alert('Failed to add Student!');
    });
    handleCloseModal();
    window.location.reload();
  };
*/
  const handleUpdate = () => {
     console.log("update function");
    
    const studentData = {
      student_name: Name,
      student_email: Email,
      student_mobile: Mobile,
      student_registerno: RegisterNo,
      student_passout:PassoutYear,
      student_gender:Gender,
      student_graduation: Graduation,
      student_department: Department
    };
  
    fetch(`http://localhost:9000/updateStudentById/${ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "apikey": generateApiKey()
      },
      body: JSON.stringify(studentData)
    })
    .then(response => {
      if (response.ok) {
        console.log("Student updated successfully!");
        handleCloseModal(); // Call the function to close the modal
        window.location.reload(); // Uncomment this line to reload the window after update
      } else {
        console.error("Failed to update student:", response.statusText);
        Alert("Failed to update student.");
      }
    })
    .catch(error => {
      console.error("Failed to update student:", error);
      Alert("Failed to update student.");
    });
  };
  
  
  const handleDelete = () => {
    // Extract student_id from the selectedStudent object
    const { student_id } = selectedStudent;
  
    // Send DELETE request to delete student
    fetch(`http://localhost:9000/deleteStudent/${student_id}`, {
      method: "DELETE",
      headers: {
        apikey: generateApiKey()
      }
    })
      .then(response => {
        if (response.ok) {
          alert("Student deleted successfully!");
        } else {
          throw new Error("Failed to delete student");
        }
      })
      .catch(error => console.error(error));
    handleCloseModal();
    window.location.reload();

  };

  const StudentFilter =(Q) =>{
    fetch(`http://localhost:9000/listStudents?q=${Q}`, {
      headers: {
        apikey: generateApiKey()
      }
    })
      .then(response => response.json())
      .then(data => {
        setStudentsdata(data);
      })
      .catch(error => console.error(error));
  }

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const pageSize = 2; // number of items to display per page

  const startIndex = (currentPage - 1) * pageSize;
  let endIndex = startIndex + pageSize;
  if (endIndex > Studentsdata?.data?.length) {
    endIndex = Studentsdata?.data?.length;
  }

  const currentStudentData = Studentsdata?.data?.slice(startIndex, endIndex);


  const totalPages = Math.ceil(Studentsdata?.data?.length / pageSize);

  
  const tableRows = currentStudentData?.map((student, index) => (
    <tr key={student.student_id} className="text-left">
      <td>{startIndex + index + 1}</td>
      <td>{student.student_name}</td>
      <td>{student.student_department}</td>
      <td>
      <span onClick={() => handleViewStudent(student.student_id)} className="btn btn-primary ml-1" style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
              </svg>
            </span>
        <span onClick={() => handleUpdateStudent(student.student_id)} className="btn btn-info ml-1" style={{ cursor: 'pointer' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
</svg>
        </span>
        <span onClick={() => handleDeleteStudent(student.student_id)} className="btn btn-danger ml-1" style={{ cursor: 'pointer' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
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
      onChange={e => StudentFilter(e.target.value)} 
    />
    <InputGroupAddon addonType="append">
      <InputGroupText>
        <i className="nc-icon nc-zoom-split" />
      </InputGroupText>
    </InputGroupAddon>
  </InputGroup>
  </CardHeader>

          {/*
        <CardHeader className="text-right text-primary">
          <h5 >
            <i className="nc-icon nc-simple-add mx-2" 
            onClick={() =>  setIsAddModalOpen(true)}
            style={{ cursor: 'pointer' }} >

            </i>
          </h5>
        </CardHeader>
         */}

          <CardBody>
            {/* Table */}
            <Table striped bordered hover>
              <thead className="text-primary">
                <tr className="text-left">
                  <th>Sno</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
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
        <ModalHeader toggle={handleCloseModal}><h6 className=" text-primary">View Student</h6></ModalHeader>
        <ModalBody>
          {/* Render View Student form */}
          {selectedStudent && (
            <code className="">
              <Form>
                  <Row>
                  <CardBody>
                    
                  <div className="author">
                    <img
                      alt="..."
                    className="avatar border-gray"
                        src={Profilepath}
                   />
                    </div>
                  </CardBody>

                    <Col md="6">
                      <FormGroup>
                        <label  >Name</label  >
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
                        <label  >RegisterNo</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={RegisterNo} 
                          disabled
                        />
                      </FormGroup>
                    </Col>
                 

                    <Col md="6">
                      <FormGroup>
                        <label  >Mobile</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={Mobile} 
                          disabled
                        />
                      </FormGroup>
                    </Col>
                 
                    <Col md="12">
                      <FormGroup>
                        <label  >Email</label  >
                        <Input
                          type="gmail"
                          defaultValue=""
                          value={Email} 
                          disabled
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <label  >Passout Year</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={PassoutYear} 
                          disabled
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <label  >Gender</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={Gender} 
                          disabled
                        />
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label  >Graduation</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={Graduation} 
                          disabled
                        />
                      </FormGroup>
                    </Col>

                    <Col md="9">
                      <FormGroup>
                        <label  >Department</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={Department} 
                          disabled
                        />
                      </FormGroup>
                    </Col>

                  </Row>
                </Form>
            </code>
          )}
        </ModalBody>
      </Modal>


    
      {/* Update Student Modal */}
      <Modal isOpen={isUpdateModalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}><h6 className=" text-primary">Update Student</h6></ModalHeader>
        <ModalBody>
          {/* Render update student form */}
          {selectedStudent && (
            <code>
              <Form>
                  <Row>
                  <Col md="6">
                      <FormGroup>
                        <label  >Name</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={Name} 
                          
                          onChange={(event) => setName(event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label  >RegisterNo</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={RegisterNo} 
                          onChange={(event) => setRegisterNo(event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                 

                    <Col md="6">
                      <FormGroup>
                        <label  >Mobile</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={Mobile} 
                          onChange={(event) => setMobile(event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <label  >Email</label  >
                        <Input
                          type="gmail"
                          defaultValue=""
                          value={Email} 
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    
                    <Col md="6">
                      <FormGroup>
                          <Label   for="passout">Passout Year</Label  >
                             <select
       
                                 className="form-control" 
                                  value={PassoutYear}
                                 onChange={(e) => setPassoutYear(e.target.value)}
                                 >
                                  <option value="">-Year of Passout-</option>
                                  <option value="2023">2023</option>
                                  <option value="2024">2024</option>
                                  <option value="2025">2025</option>
                                   <option value="2026">2026</option>
                                  <option value="2027">2027</option>
                                  <option value="2028">2028</option>
                                  </select>
                         </FormGroup>
                      </Col>
                      <Col md="6">
                      <FormGroup>
                          <Label   >Gender</Label  >
                  <select  className="form-control"  value={Gender} onChange={(e) =>{setGender(e.target.value)}}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    </FormGroup>
                </Col>
                <Col md="3">
                      <FormGroup>
                          <Label   >Graduation</Label  >
                             <select
       
                                 className="form-control" 
                                  value={Graduation}
                                 onChange={(e) => setGraduation(e.target.value)}
                                 >
                                 <option value="UG">UG</option>
                                 <option value="PG">PG</option>
                                  </select>
                         </FormGroup>
                      </Col>
                      <Col md="9">
                      <FormGroup>
                          <Label   >Department</Label  >
                             <select
       
                                 className="form-control" 
                                  value={Department}
                                 onChange={(e) => setDepartment(e.target.value)}
                                 >
                                 <option value="B.Tech. - Information Technology (IT)">B.Tech. - Information Technology (IT)</option>
                                 <option value="B.E - Automobile Engineering(AU)">B.E - Automobile Engineering(AU)</option>
                                 <option value="B.E - Civil Engineering (CE)">B.E - Civil Engineering (CE)</option>
                                 <option value="B.E - Computer Science and Engineering (CSE)">B.E - Computer Science and Engineering (CSE)</option>
                                 <option value="B.E - Electronics and Communication Engineering(ECE)">B.E - Electronics and Communication Engineering(ECE)</option>
                                 <option value="B.E - Electrical and Electronics Engineering(EEE)">B.E - Electrical and Electronics Engineering(EEE)</option>
                                 <option value="B.E - Mechnical Engineering(ME)">B.E - Mechnical Engineering(ME)</option>
                                 <option value="B.E - Safety and Fire Engineering(SFE)">B.E - Safety and Fire Engineering(SFE)</option>
                                 <option value="M.E - Structural Engineering(SE)">M.E - Structural Engineering(SE)</option>
                                 <option value="M.E - Construction Management and Engineering(CME)">M.E - Construction Management and Engineering(CME)</option>
                                 <option value="M.E - Communication System(CS)">M.E - Communication System(CS)</option>
                                 <option value="M.E - Power Electronics and Drives(PED)">M.E - Power Electronics and Drives(PED)</option>
                                 <option value="M.E - Computer Science and Engineering(CSE)">M.E - Computer Science and Engineering(CSE)</option>
                                 <option value="M.Tech.- Information Technology(IT)">M.Tech.- Information Technology(IT)</option>
                                 <option value="M.E -Industrial and Safety Engineering (ISE)">M.E -Industrial and Safety Engineering (ISE)</option>
                                 <option value="MBA - Master of Business Administration">MBA - Master of Business Administration</option>
                                 <option value="MCA - Master of Computer Application">MCA - Master of Computer Application</option>
                                 <option value="MBA">MBA</option>
                                 <option value="MCA - Master of Computer Applications">MCA - Master of Computer Applications</option>
                                  </select>
                         </FormGroup>
                      </Col>
                  </Row>
                </Form>
            </code>
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

         {/* Delete Student Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}><h6 className=" text-primary">Delete Student</h6></ModalHeader>
        <ModalBody>
          {/* Render delete question confirmation */}
          {selectedStudent && (
            <div>
              <p>Are you sure you want to delete the following Student detaile?</p>
              <p>Name : {selectedStudent.student_name}</p>
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

      {/* Add Student Modal 
      <Modal isOpen={isAddModalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}><h6 className=" text-primary">Add Student</h6></ModalHeader>
        <ModalBody>
        <div>
              <Form>
                  <Row>
                  <Col md="12">
                      <FormGroup>
                        <label  >Name</label  >
                        <Input
                          type=""
                          defaultValue=""
                          value={Name} 
                          
                          onChange={(event) => setName(event.target.value)}
                        />
                        {console.log(Name)}
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <label  >Email</label  >
                        <Input
                          type="gmail"
                          defaultValue=""
                          value={Email} 
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
            </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleAddStudent}>
            Add
          </Button>{" "}
          <Button color="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      */}
    </>
  );
}

export default ListStudents;