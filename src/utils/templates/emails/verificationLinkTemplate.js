const verificationLinkTemplate = (resetLink) => {
	return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    padding: 20px;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 20px;
                }
                .banner {
                    background-color: #1a1b41;
                    color: white;
                    padding: 30px;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .lock-icon {
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                .content {
                    padding: 20px;
                    color: #333;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #1a1b41;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .footer {
                    background-color: #1a1b41;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }
                .social-links {
                    margin-bottom: 10px;
                }
                .social-links a {
                    color: white;
                    margin: 0 10px;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="[Your Logo URL]" alt="Company Logo" class="logo">
                </div>
                <div class="banner">
                    <div class="lock-icon">🔒</div>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>We have sent you this email in response to your request to reset your password on company name.</p>
                    <p>To reset your password, please follow the link below:</p>
                    <div style="text-align: center;">
                        <a href="${resetLink}" class="button">Reset Password</a>
                    </div>
                    <p style="color: #666; font-style: italic;">Please ignore this email if you did not request a password change.</p>
                </div>
                <div class="footer">
                    <div class="social-links">
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">LinkedIn</a>
                        <a href="#">Instagram</a>
                    </div>
                    <p>1512 McArthur Road, FL 11223</p>
                    <p>+111 222 333 | info@company.com</p>
                    <p>Company © All Rights Reserved</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
module.exports = verificationLinkTemplate;
