//  import sql
const sql = require("../../config/db.config");
const {saveImageFromDataUrl} = require("../../assist/file.control");
const { hashPassword, verifyPassword} = require("../../middleware/hash");
const { signJwt, verifyJwt} = require("../../middleware/jwt");
const Login = function (orgType) {};


const logins = async (type, email, password, result) => {
    try {
      const query = `SELECT * FROM ${type} WHERE ${type}_email = ? AND status != ?`;
      const values = [email, 'D'];
      sql.query(query, values, async (err, res) => {
        if (err) {
          console.log("error: ", err);
          return result({ message: "Error occurred while logging in" }, null);
        }
        if (res.length) {
          const isPasswordValid = await verifyPassword(password, res[0][`${type}_password`]);
          if (!isPasswordValid) {
            return result({ message: "Invalid password" }, null);
          } else {
            const token = await signJwt({ email, type });
            const insertQuery = "INSERT INTO login (login_email, login_type) VALUES (?, ?)";
            const insertValues = [email, type];
            sql.query(insertQuery, insertValues, (err, res) => {
              if (err) {
                console.log("error: ", err);
                return result({ message: "Error occurred while logging in" }, null);
              }
              console.log("Login details inserted into login table");
              const userData = { ...res[0], token };
              console.log(`found ${type}: `, userData);
              return result(null, token);
            });
          }
        } else {
          return result({ kind: "not_found" }, null);
        }
      });
    } catch (err) {
      console.log("error: ", err);
      return result({ message: "Error occurred while logging in" }, null);
    }
  };
  
  Login.login = async (details, result) => {
    if (details.type === "student") {
      logins(details.type, details.email, details.password,  result);
    } else if (details.type === "admin") {
      logins(details.type, details.email, details.password,  result);
    } else {
      logins(details.type, details.email, details.password,  result);
    }
  };
  
  const verifypass = async (type, email, password, result) => {
    try {
      const query = `SELECT * FROM ${type} WHERE ${type}_email = ? AND status != ?`;
      const values = [email, 'D'];
      sql.query(query, values, async (err, res) => {
        if (err) {
          console.log("error: ", err);
          return result({ message: "Error occurred while Verify password" }, null);
        }
        if (res.length) {
          const isPasswordValid = await verifyPassword(password, res[0][`${type}_password`]);
          if (!isPasswordValid) {
            return result({verify:false , message: "Invalid password" }, null);
          } else {
              console.log({verify:true , message: "verify password Successfully"});
              return result(null, {verify:true , message: "verify password Successfully"});
          }
        } else {
          return result({ kind: "not_found" }, null);
        }
      });
    } catch (err) {
      console.log("error: ", err);
      return result({ message: "Error occurred while Verify password" }, null);
    }
  };
  
  Login.verifypasswords = async (details, result) => {
    if (details.type === "student") {
      verifypass(details.type, details.email, details.password,  result);
    } else if (details.type === "admin") {
      verifypass(details.type, details.email, details.password,  result);
    } else {
      verifypass(details.type, details.email, details.password,  result);
    }
  };

  const changepass = async (type, email, password, result) => {
    try { 
      console.log(password);
      const hashedPassword = await hashPassword(password);
      console.log("hashedPassword", hashedPassword);
        sql.query(
          `UPDATE ${type} SET  ${type}_password = ? WHERE ${type}_email = ?;`,
          [ hashedPassword,  email],
          (err, res) => {
            if (err) {
              result(err, null);
              return;
            }
            if (res.affectedRows === 0) {
              result({ kind: "not_found" }, null);
              return;
            }
            console.log(`${type} Password Change: ${email}`, { email: email });
            result(null, {change_password:true ,message: "Password Change Successfully" });
          }
        );
    } catch (err) {
      console.log("error: ", err);
      return result({ change_password:false ,message: "Error occurred while change password" }, null);
    }
  };
  


  Login.changepassword = async (details, result) => {
    if (details.type === "student") {
      changepass(details.type, details.email, details.password,  result);
    } else if (details.type === "admin") {
      changepass(details.type, details.email, details.password,  result);
    } else {
      changepass(details.type, details.email, details.password,  result);
    }
  };

Login.verifylogin = async (verify, result) => {
  try {
    const Verify =  await verifyJwt(verify.token);
    if (Verify === null){
      return result({ message: "Error occurred while verifying login" }, null);
    }
    else if (Verify.email){
      return result(null , Verify);
    }
  } catch (err) {
    // Handle errors
    console.log("error: ", err);
    return result({ message: "Error occurred while verifying login" }, null);
  }
};


Login.checkmail = (email, result) => {
  const query = `
    SELECT *
    FROM (
      SELECT student_email AS email, 'students' AS type, status FROM student
      UNION
      SELECT admin_email AS email, 'admin' AS type, status FROM admin
      UNION
      SELECT master_email AS email, 'master' AS type, status FROM master
    ) AS t
    WHERE email = ? AND status != 'D'
  `;
  const values = [email];
  sql.query(query, values, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("Email found: ", res[0]);
      result(null, { found: true ,data:res[0]});
      return;
    }
    result(null, { found: false });
  });
};


const getUser = async (email,type) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${type} WHERE ${type}_email = ? AND status != ?`;
    const values = [email, 'D'];
    sql.query(query, values, async (err, res) => {
      if (err) {
        console.log("Error: ", err);
        return reject({ message: "Error occurred while retrieving user details" });
      }
      if (res.length) {
        const userData = { ...res[0] };
        console.log(`Found user in ${type}: `, userData);
        return resolve(userData);
      } else {
        return reject({ kind: "not_found" });
      }
    });
  });
};

Login.getuser= async (input, result) => {
  try {
    let userData;
    if (input.type === "student") {
      userData = await getUser( input.email,input.type);
    } else if (input.type === "admin") {
      userData = await getUser(input.email,input.type);
    } else {
      userData = await getUser(input.email,input.type);
    }
    return result(null, userData);
  } catch (err) {
    console.log("Error: ", err);
    return result(err, null);
  }
};


module.exports = Login;
