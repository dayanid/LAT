//  import sql
const sql = require("../../config/db.config");
const {saveImageFromDataUrl} = require("../../assist/file.control");
const { hashPassword, verifyPassword} = require("../../middleware/hash");
const { signJwt, verifyJwt} = require("../../middleware/jwt");
const Master = function (orgType) {};


Master.create = async (newMaster, result) => {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(newMaster.master_password);
    console.log("hashedPassword", hashedPassword);

    // Insert data into the database
    const query =
      "INSERT INTO master (master_name, master_mobile,  master_email,   master_department, master_position, master_password) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      newMaster.master_name,
      newMaster.master_mobile,
      newMaster.master_email,
      newMaster.master_department,
      newMaster.master_position,
      hashedPassword
    ];
    await sql.query(query, values);
    // Return the newly created master data
    result(null, { ...newMaster });
  } catch (err) {
    // Handle errors
    result(err, null);
  }
};

Master.changepassword = async (ChangePass, result) => {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(ChangePass.master_password);
    console.log("hashedPassword", hashedPassword);

    // Insert data into the database
    const query =
      "UPDATE Master SET  master_password = ?, updated_at = NOW() WHERE master_email = ?;";
    const values = [
      hashedPassword,
      ChangePass.master_email
    ];
    await sql.query(query, values);
    // Return the newly created master data
    result(null, { ...ChangePass });
  } catch (err) {
    // Handle errors
    result(err, null);
  }
};






module.exports = Master;
