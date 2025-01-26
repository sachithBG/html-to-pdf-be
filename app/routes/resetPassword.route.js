const express = require('express');
const {
    sendOtp,
    verifyOtp,
    resetPassword,
} = require('../services/resetPassword.service');

const router = express.Router();

// Route to send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        await sendOtp(email);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

        const isValid = await verifyOtp(email, otp);
        if (!isValid) return res.status(400).json({ message: 'Invalid OTP' });

        res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    }
});

// Route to reset password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword)
            return res.status(400).json({ message: 'Email and new password are required' });

        await resetPassword(email, newPassword);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset password', error: error.message });
    }
});

module.exports = router;
