const bcrypt = require('bcryptjs');

// Function to hash a password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw err;
  }
};

// Function to verify a password
const verifyPassword = async (password, hashedPassword) => {
  try {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  } catch (err) {
    throw err;
  }
};

// Export the functions as an object
module.exports = {
  hashPassword,
  verifyPassword
};
