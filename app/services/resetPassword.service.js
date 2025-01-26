const bcrypt = require('bcryptjs');
const { saveOtp, getOtpByEmail, updatePassword, deleteOtpByEmail } = require('../repositories/resetPassword.repository');
const { sendEmail } = require('./emailService');
const { generateOtp } = require('../utils/otpGenerator');
const userRepository = require('../repositories/user.repository');

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10); // Hash password with a salt of 10 rounds
};

const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash); // Verify if the password matches the hash
};

const sendOtp = async (email) => {
    const usr = await userRepository.findUserByEmail(email); // Check if the user exists'
    if (!usr) throw new Error('User not found'); // User not found
    const otp = generateOtp(6); // Generate a 6-digit OTP
    await saveOtp(email, otp); // Save OTP to the database
    await sendEmail(email, 'Your OTP Code', `Your OTP is ${otp}`); // Send OTP via email
};

const verifyOtp = async (email, otp) => {
    const savedOtp = await getOtpByEmail(email);
    if (!savedOtp || savedOtp.otp !== otp) return false; // Invalid OTP

    return true;
};

const resetPassword = async (email, newPassword) => {
    const savedOtp = await getOtpByEmail(email);
    if (!savedOtp) throw new Error('OTP not found'); // OTP not found
    const hashedPassword = await hashPassword(newPassword); // Hash the new password
    await updatePassword(email, hashedPassword); // Update the password in the database
    await deleteOtpByEmail(email); // Delete the OTP from the database
};

module.exports = {
    hashPassword,
    verifyPassword,
    sendOtp,
    verifyOtp,
    resetPassword,
};
