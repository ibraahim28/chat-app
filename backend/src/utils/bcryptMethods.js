const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}

const comparePasswords = async (plain, hashed) => {
  const isValidPass = await bcrypt.compare(plain, hashed);
  return isValidPass
}

module.exports = { hashPassword, comparePasswords }