// templates/emails/resetPasswordTemplate.js
module.exports = (verificationLink) => {
    return `
      <html>
        <body>
          <h1>Password Reset Request</h1>
          <p>We received a request to reset your password. Click the link below to reset your password:</p>
          <a href="${verificationLink}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        </body>
      </html>
    `;
  };
  