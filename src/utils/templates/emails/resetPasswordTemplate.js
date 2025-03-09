module.exports = (verificationCode) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Reset default styles */
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          line-height: 1.6;
          background-color: #f4f4f4;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container {
          width: 100%;
          height: 100vh;
          max-width: 100%;
          max-height: 100%;
          background-color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }
        .wave-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 150px;
          background-color: #FFC0CB;
          border-radius: 0 0 50% 50%;
          z-index: 1;
        }
        .content {
          padding: 30px;
          max-width: 400px;
          width: 100%;
          z-index: 2;
          position: relative;
        }
        .icon-circle {
          width: 60px;
          height: 60px;
          background-color: #FFC0CB;
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-circle span {
          font-size: 30px;
        }
        h2 {
          color: #333;
          margin: 0 0 10px;
          font-size: 22px;
          font-weight: 600;
        }
        p {
          color: #666;
          font-size: 14px;
          margin: 0 0 15px;
          line-height: 1.5;
        }
        .code-box {
          background-color: #f9f9f9;
          border: 1px dashed #FFC0CB;
          border-radius: 8px;
          padding: 15px;
          font-size: 20px;
          font-weight: bold;
          color: #333;
          letter-spacing: 2px;
          margin: 20px auto;
          width: 80%;
          max-width: 200px;
          display: inline-block;
        }
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 15px;
        }
        .footer a {
          color: #FFC0CB;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        /* Responsive adjustments */
        @media (max-width: 600px) {
          .container {
            height: auto;
            min-height: 100vh;
          }
          .wave-top {
            height: 100px;
            border-radius: 0 0 30% 30%;
          }
          .content {
            padding: 20px;
          }
          h2 {
            font-size: 20px;
          }
          p {
            font-size: 13px;
          }
          .code-box {
            font-size: 18px;
            padding: 12px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="wave-top"></div>
        <div class="content">
          <div class="icon-circle">
            <span>🔑</span>
          </div>
          <h2>Reset Your Password</h2>
          <p>Hi there! We received a request to reset your Menufy password. Use the code below to complete the process:</p>
          <div class="code-box">${verificationCode}</div>
          <p>This code expires in 15 minutes. If you didn’t request a password reset, you can safely ignore this email.</p>
          <p class="footer">
            Need help? <a href="mailto:support@menufy.com">Contact support</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
