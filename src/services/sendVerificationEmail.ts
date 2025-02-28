import nodemailer from 'nodemailer';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string
) : Promise<ApiResponse> {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    .header {
                        background: #7c3aed;
                        padding: 20px;
                        text-align: center;
                        border-radius: 8px 8px 0 0;
                    }
                    .header h1 {
                        color: white;
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        background: #ffffff;
                        padding: 30px;
                        border: 1px solid #e5e7eb;
                        border-radius: 0 0 8px 8px;
                    }
                    .otp-box {
                        background: #f3f4f6;
                        padding: 15px;
                        text-align: center;
                        border-radius: 8px;
                        font-size: 24px;
                        letter-spacing: 5px;
                        margin: 20px 0;
                        font-weight: bold;
                        color: #1f2937;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #6b7280;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Spendly</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${username}!</h2>
                        <p>Thank you for choosing Spendly. Please use the following verification code to complete your registration:</p>
                        <div class="otp-box">
                            ${otp}
                        </div>
                        <p>This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.</p>
                        <p>Best regards,<br>The Spendly Team</p>
                    </div>
                    <div class="footer">
                        © ${new Date().getFullYear()} Spendly. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Spendly | Verification Code',
            html: htmlContent,
            text: `Hello ${username},\n\nYour verification code is ${otp}\n\nThanks,\nSpendly Team`, // Fallback plain text
        });

        return {
            success: true,
            message: "Verification email sent successfully"
        };
    }
    catch(err) {
        console.error("Error sending verification email.", err);
        return {
            success: false,
            message: "Failed to send verification email"
        };
    }
}