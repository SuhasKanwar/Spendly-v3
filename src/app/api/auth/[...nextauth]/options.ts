import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/services/sendVerificationEmail";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email/Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    });
                    if (!user) {
                        throw new Error("No user found with this email/username");
                    }
                    if (!user.isVerified) {
                        const otp = Math.floor(100000 + Math.random() * 900000).toString();
                        user.otp = otp;
                        user.otpExpiry = new Date(Date.now() + 3600000);
                        await user.save();
                        await sendVerificationEmail(user.email, user.username, otp);
                        throw new Error("User not verified. Please verify your account.");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user;
                    }
                    throw new Error("Incorrect password");
                } catch (err: any) {
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};