const db = require('../config/db');

// Save OTP to the database
const saveOtp = async (email, otp) => {
  const query = `
    INSERT INTO user_otp (email, otp)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE otp = ?;
  `;
  await db.query(query, [email, otp, otp]);
};

// Get OTP by email
const getOtpByEmail = async (email) => {
  const query = `SELECT * FROM user_otp WHERE email = ?`;
  const [rows] = await db.query(query, [email]);
  return rows[0];
};

// Update user's password (only the hash) in the database
const updatePassword = async (email, hashedPassword) => {
  try {
    const query = `UPDATE users SET password = ? WHERE email = ?`;
    const res = await db.query(query, [hashedPassword, email]);
    return res[0];
  } catch (error) {
    throw new Error('Failed to update password');
  }
};

const deleteOtpByEmail = async (email) => {
  const query = `DELETE FROM user_otp WHERE email = ?`;
  const [rows] = await db.query(query, [email]);
  return rows[0];
};

module.exports = {
  saveOtp,
  getOtpByEmail,
  updatePassword,
  deleteOtpByEmail
};
