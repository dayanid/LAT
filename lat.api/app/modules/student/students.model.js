//  import sql
const sql = require("../../config/db.config");
const {saveImageFromDataUrl} = require("../../assist/file.control");
const { hashPassword, verifyPassword} = require("../../middleware/hash");
const { signJwt, verifyJwt} = require("../../middleware/jwt");
const students = function (orgType) {};




students.create = async (newstudents, result) => {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(newstudents.student_password);
    console.log("hashedPassword", hashedPassword);

    // Save profile image if provided
    let profile_path = null;
    if (newstudents.student_profile !== "") {
      profile_path = await saveImageFromDataUrl(
        newstudents.student_profile,
        newstudents.student_registerno
      );
    }

    // Insert data into the database
    const query =
      "INSERT INTO student (student_name, student_mobile, student_registerno, student_passout, student_email, student_gender, student_graduation, student_department, student_profile, student_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      newstudents.student_name,
      newstudents.student_mobile,
      newstudents.student_registerno,
      newstudents.student_passout,
      newstudents.student_email,
      newstudents.student_gender,
      newstudents.student_graduation,
      newstudents.student_department,
      profile_path,
      hashedPassword
    ];
    await sql.query(query, values);

    // Return the newly created student data
    result(null, { ...newstudents });
  } catch (err) {
    // Handle errors
    result(err, null);
  }
};

students.changepassword = async (ChangePass, result) => {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(ChangePass.student_password);
    console.log("hashedPassword", hashedPassword);

    // Insert data into the database
    const query =
      "UPDATE student SET  student_password = ?, updated_at = NOW() WHERE student_email = ?;";
    const values = [
      hashedPassword,
      ChangePass.student_email
    ];
    await sql.query(query, values);
    // Return the newly created student data
    result(null, { ...ChangePass });
  } catch (err) {
    // Handle errors
    result(err, null);
  }
};


// Define the getAll function with search query, page, and limit parameters
students.getAll = (Q, page, limit) => {
  return new Promise((resolve, reject) => {
    // Check if search query is provided
    if (Q != undefined) {
      var key_value = `%${Q}%`;
      var Query = `SELECT * FROM Student WHERE (student_id LIKE '${key_value}' OR student_email LIKE '${key_value}' OR student_name LIKE '${key_value}' OR student_mobile LIKE '${key_value}' OR student_registerno LIKE '${key_value}' OR student_gender LIKE '${key_value}' OR student_graduation LIKE '${key_value}' OR student_department LIKE '${key_value}' OR student_passout LIKE '${key_value}') AND status != 'D';`;
    } else {
      // Use default query if search query is not provided
      var Query = `SELECT * FROM Student WHERE status != 'D';`;
    }  
    // Execute the SQL query
    sql.query(Query, (err, model, field) => {
      if (err) throw err;    
      // Check if pagination parameters (page and limit) are provided
      if (page && limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};   
        // Check if there are more results for next page
        if (endIndex < model.length) {
          results.next = {
            page: page + 1,
            limit: limit
          };
        }     
        // Check if there are results for previous page
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          };
        }
        // Slice the results based on startIndex and endIndex for pagination
        results.results = model.slice(startIndex, endIndex);
        var data = JSON.parse(JSON.stringify(results));
      } else {
        // If pagination parameters are not provided, return all results
        var data = JSON.parse(JSON.stringify(model));
      }
      // Resolve the data to return as the result of the promise
      resolve(data);
    });
  });
};




//Update function..
students.updateById = (id, students, result) => {
  // Check if the email id is already used
  sql.query(`SELECT * FROM student WHERE student_email = ? AND status != 'D';`, [students.student_email], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length > 1) {
      result("Email id is already used.", null);
      return;
    }

    // Update the student record with the provided id
    sql.query(
      "UPDATE students SET student_name = ?, student_mobile = ?, student_registerno = ?, student_passout = ?, student_email = ?, student_gender = ?, student_graduation = ?, student_department = ?, updated_at = NOW() WHERE student_id = ?;",
      [students.student_name, students.student_mobile, students.student_registerno, students.student_passout, students.student_email, students.student_gender, students.student_graduation, students.student_department,  id],
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        if (res.affectedRows === 0) {
          result({ kind: "not_found" }, null);
          return;
        }
        console.log(`updated student: ${id}`, { id: id, ...students });
        result(null, { id: id, ...students });
      }
    );
  });
};


//find function..
students.findById = (id, result) => {
  sql.query(`SELECT * FROM  student WHERE student_id =${id} and status != 'D'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found student: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found
    result({ kind: "not_found" }, null);
  });
};

//get Login details by Email function...
students.LoginDetailsByEmail = (email, result) => {
  sql.query(`SELECT * FROM  login WHERE login_email = "${email}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found Login: ", res);
      result(null, res);
      return;
    }
    // not found
    result({ login: "not_found" }, null);
  });
};


//get Login details function..
students.LoginDetails = (result) => {
  sql.query(`SELECT * FROM  login `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found Login: ", res);
      result(null, res);
      return;
    }
    // not found
    result({ login: "not_found" }, null);
  });
};

//find function..
students.findByEmail = (email, result) => {
  sql.query(`SELECT * FROM  student WHERE student_email ="${email}" and status != 'D'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found student: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found
    result({ kind: "not_found" }, null);
  });
};

//deleting function..
students.remove = (email, result) => {
  sql.query(`UPDATE  student SET status = 'D' WHERE student_email = ?`, email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }
    console.log(`deleted  student  with email: ${email}`);
    result(null, res);
  });
};

module.exports = students;
