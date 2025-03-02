const createVerificationTemplate = (verificationLink) => {
	return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #FF6B6B;
                    padding: 30px 20px;
                    text-align: center;
                }
                .logo {
                    width: 150px;
                    margin-bottom: 20px;
                }
                .header h1 {
                    color: white;
                    font-size: 24px;
                    margin: 0;
                }
                .content {
                    padding: 40px 20px;
                    color: #333333;
                }
                .verification-icon {
                    text-align: center;
                    margin-bottom: 25px;
                }
                .verification-icon img {
                    width: 80px;
                    height: 80px;
                }
                .button-container {
                    text-align: center;
                    margin: 30px 0;
                }
                .verify-button {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #FF6B6B;
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 14px;
                    transition: background-color 0.3s;
                }
                .verify-button:hover {
                    background-color: #ff5252;
                }
                .footer {
                    background-color: #2D3436;
                    color: #ffffff;
                    padding: 30px 20px;
                    text-align: center;
                }
                .social-links {
                    margin-bottom: 20px;
                }
                .social-links a {
                    display: inline-block;
                    margin: 0 10px;
                    color: white;
                    text-decoration: none;
                }
                .social-links img {
                    width: 24px;
                    height: 24px;
                }
                .footer-text {
                    font-size: 12px;
                    color: #cccccc;
                }
                @media only screen and (max-width: 600px) {
                    .container {
                        width: 100%;
                        border-radius: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://menufy-logo-url.com/logo.png" alt="Menufy" class="logo">
                </div>
                <div class="content">
                    <div class="verification-icon">
                        <img src="https://menufy-assets.com/email-icon.png" alt="Verification Icon">
                    </div>
                    <p>Hello!</p>
                    <p style="margin: 20px 0;">Welcome to Menufy! We're excited to have you on board. To start using your account, please verify your email address by clicking the button below:</p>
                    <div class="button-container">
                        <a href="${verificationLink}" class="verify-button">Verify Email</a>
                    </div>
                    <p style="margin-top: 20px;">If you didn't create an account with Menufy, you can safely ignore this email.</p>
                    <p style="margin-top: 20px; color: #666666;">This link will expire in 24 hours.</p>
                </div>
                <div class="footer">
                    <div class="social-links">
                        <a href="https://facebook.com/menufy"><img src="https://menufy-assets.com/facebook-icon.png" alt="Facebook"></a>
                        <a href="https://twitter.com/menufy"><img src="https://menufy-assets.com/twitter-icon.png" alt="Twitter"></a>
                        <a href="https://instagram.com/menufy"><img src="https://menufy-assets.com/instagram-icon.png" alt="Instagram"></a>
                        <a href="https://linkedin.com/company/menufy"><img src="https://menufy-assets.com/linkedin-icon.png" alt="LinkedIn"></a>
                    </div>
                    <div class="footer-text">
                        <p>© 2024 Menufy. All rights reserved.</p>
                        <p style="margin-top: 10px;">123 Restaurant Street, Food City, FC 12345</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};
module.exports = createVerificationTemplate;
