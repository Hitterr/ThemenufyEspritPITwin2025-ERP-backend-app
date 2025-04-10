module.exports = (verificationCode) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Password Reset Verification</title>
      <style>
        :root {
          --primary-color: #FA8072;
          --secondary-color: #FFC0CB;
          --background-color: #f4f4f4;
          --text-primary: #333333;
          --text-secondary: #666666;
          --white: #ffffff;
        }

        /* Base styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          line-height: 1.6;
          background-color: var(--background-color);
          color: var(--text-primary);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .container {
          max-width: 480px;
          width: 100%;
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          position: relative;
        }

        .wave-top {
          width: 100%;
          height: 120px;
          background: linear-gradient(135deg, var(--primary-color), #ff9472);
          clip-path: ellipse(80% 60% at 50% 0%);
          position: absolute;
          top: 0;
          left: 0;
        }

        .content {
          padding: 40px 30px;
          position: relative;
          text-align: center;
        }

        .icon-circle {
          width: 64px;
          height: 64px;
          background-color: var(--primary-color);
          border-radius: 50%;
          margin: 0 auto 24px;
          display: grid;
          place-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .icon-circle span {
          font-size: 32px;
          color: var(--white);
        }

        h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        p {
          font-size: 15px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .code-box {
          background-color: #fafafa;
          border: 2px dashed var(--secondary-color);
          border-radius: 10px;
          padding: 16px;
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 3px;
          margin: 24px auto;
          max-width: 220px;
          word-break: break-all;
        }

        .footer {
          font-size: 13px;
          color: #888888;
          margin-top: 24px;
        }

        .footer a {
          color: var(--primary-color);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer a:hover {
          color: #ff9472;
          text-decoration: underline;
        }

        /* Media Queries */
        @media (max-width: 480px) {
          .container {
            border-radius: 8px;
          }

          .wave-top {
            height: 100px;
          }

          .content {
            padding: 30px 20px;
          }

          h2 {
            font-size: 20px;
          }

          p {
            font-size: 14px;
          }

          .code-box {
            font-size: 20px;
            padding: 14px;
            max-width: 180px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="wave-top"></div>
        <div class="content">
          <div class="icon-circle">
            <span aria-hidden="true">🔑</span>
          </div>
          <h2>Reset Your Password</h2>
          <p>Hello! We've received a request to reset your Menufy password. Please use this verification code:</p>
          <div class="code-box" role="alert" aria-label="Verification code: ${verificationCode}">
            ${verificationCode}
          </div>
          <p>This code will expire in 15 minutes. If you didn't request this reset, feel free to ignore this email.</p>
          <p class="footer">
            Questions? <a href="mailto:support@menufy.com" target="_blank">Contact our support team</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
