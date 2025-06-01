const { createTransport } = require("nodemailer");

const forgetPassMail = async (to, token, clientHost) => {
  return new Promise(async (resolve, reject) => {
    const date = new Date();
    const formatDate = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)

    const transporter = await createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    const resetUrl = await `${clientHost}/forgot-password/${token}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>You have requested a password reset. Please click the link below to reset your password.</p>
      <a href="${resetUrl}" clicktracking=off>Change Password</a>
      <p>This link valid for 10 minute</p>
    `

    const mailOptions = await {
      from: process.env.EMAIL,
      to: to,
      subject: 'Reset Password Request',
      html: message
    };

    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        console.log('email sent=>', info?.response);
        resolve(info);
      }
    });
  });

}


module.exports = forgetPassMail;