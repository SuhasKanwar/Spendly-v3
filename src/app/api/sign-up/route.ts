import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/services/sendVerificationEmail";

function generateOTP() : string{
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request){
    await dbConnect();

    try{
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({ username: username, isVerified: true });

        if(existingVerifiedUserByUsername){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const otp = generateOTP();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "Email is already registered"
                    },
                    {
                        status: 400
                    }
                );
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.otp = otp;
                existingUserByEmail.otpExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                otp,
                otpExpiry: expiryDate,
                isVerified: false,
                messages: []
            });

            await newUser.save();
        }
        const emailResponse = await sendVerificationEmail(email, username, otp);
        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "User Registered Successfully. Please verify your email."
            },
            {
                status: 201
            }
        );
    }
    catch(err){
        console.error("Error registering the user", err);
        return Response.json(
            {
                success: false,
                message: "Error Registering the User."
            },
            {
                status: 500
            }
        );
    }
}