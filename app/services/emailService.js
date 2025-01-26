const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        // host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        // port: parseInt(process.env.SMTP_PORT || '2525'),
        // secure: false,
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });
};

module.exports = {
    sendEmail,
};
