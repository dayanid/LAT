//  import sql
const sql = require("../../config/db.config");
const {saveImageFromDataUrl} = require("../../assist/file.control");
const { hashPassword, verifyPassword} = require("../../middleware/hash");
const { signJwt, verifyJwt} = require("../../middleware/jwt");
const Admin = function (orgType) {};


Admin.create = async (newAdmin, result) => {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(newAdmin.admin_password);
    console.log("hashedPassword", hashedPassword);

    // Insert data into the database
    const query =
      "INSERT INTO admin (admin_name, admin_mobile,  admin_email,  admin_faculty_id, admin_department, admin_position, admin_password) VALUES (?,?, ?, ?, ?, ?, ?)";
    const values = [
      newAdmin.admin_name,
      newAdmin.admin_mobile,
      newAdmin.admin_email,
      newAdmin.admin_faculty_id,
      newAdmin.admin_department,
      newAdmin.admin_position,
      hashedPassword
    ];
    await sql.query(query, values);
    // Return the newly created admin data
    result(null, { ...newAdmin });
  } catch (err) {
    // Handle errors
    result(err, null);
  }
};

Admin.changepassword = async (ChangePass, result) => {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(ChangePass.admin_password);
    console.log("hashedPassword", hashedPassword);

    // Insert data into the database
    const query =
      "UPDATE Admin SET  admin_password = ?, updated_at = NOW() WHERE admin_email = ?;";
    const values = [
      hashedPassword,
      ChangePass.admin_email
    ];
    await sql.query(query, values);
    // Return the newly created admin data
    result(null, { ...ChangePass });
  } catch (err) {
    // Handle errors
    result(err, null);
  }
};



module.exports = Admin;
