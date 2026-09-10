import User from "../models/user.model.js";
import hashPassword from "../utils/hashPass.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt"
import { sendEmail } from '../utils/email.js';

export const registerUser = async (req, res) => {
    try {
        const {name, lastname, email, password, role} = req.body;
        if(!name || !lastname || !email || !password){
            return res.status(400).json({
                message: "name, lastname, email and password are required"
            })
        }

        
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(401).json({
                message: "user alraedy exists"
            })
        }
        const hashedPassword = await hashPassword(password)

        const avatar = req.file?.path || ""

        const otp = Math.floor(100000 + Math.random() * 900000)

        console.log("Verification OTP:", otp)

        const user = await User.create({
            name,
            lastname,
            email,
            password: hashedPassword,
            role: role,
            avatar,
            verificationOtp: otp,
            verificationOtpExpires: new Date(Date.now() + 10 * 60 * 1000)
        })

        return res.status(201).json({
            message: "user successfully created", 
            user
        })

    } 

    catch (error) {
        return res.status(500).json(
            {
                message: " internal server error",
                error: error.message
            }
        )
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                message: "email and password are required"
            })
        }
        const existUser = await User.findOne({email})
        if(!existUser){
            return res.status(404).json({
                message: "user not found"
            })
        }
        const isCorrectPassword = await bcrypt.compare(password, existUser.password)
        if(!isCorrectPassword){
            return res.status(401).json({message: "incorrect password"})
        }
        const token = await generateToken(existUser._id)
        return res.status(200).json({
            message: "user login successful",
            token,
            user: email
        })
    } catch (error) {
        return res.status(500).json(
            {
                message: " internal server error",
                error: error.message
            }
        )
    }
}


export const logoutUser = async (req, res) => {
    try {
       res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "email, oldPassword and newPassword are required" });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, existingUser.password);
        if (!isOldPasswordCorrect) {
            return res.status(401).json({ message: "Invalid old password" });
        }

        const hashedNewPassword = await hashPassword(newPassword);
        existingUser.password = hashedNewPassword;
        await existingUser.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body
        const normalizedOtp = String(otp).trim()

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (user.isVerified) {
            return res.status(400).json({
                message: "Email is already verified"
            })
        }
        if (!user.verificationOtp) {
            return res.status(400).json({
                message: "No verification OTP found"
            })
        }
        if (user.verificationOtpExpires < new Date()) {
            return res.status(400).json({
                message: "OTP has expired"
            })
        }
        if (String(user.verificationOtp) !== normalizedOtp) {
            return res.status(400).json({
                message: "Invalid OTP"
            })
        }

        user.isVerified = true;
        user.verificationOtp = undefined
        user.verificationOtpExpires = undefined

        await user.save()

        return res.status(200).json({
            message: "Email verified successfully"
         })

    } catch (error) {
        return res.status(500).json(
            {
                message: " internal server error",
                error: error.message
            }
        )
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // It's often good practice to return a generic message to prevent email enumeration
            return res.status(404).json({ message: "email is not register" });
        }
        // If this email is registered, an OTP will be sent.
        
        // 2. Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Save OTP and expiration time to the user's document
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        await user.save();

        // 4. Send the OTP via Email
        const subject = 'Event-hub - Password Reset Request';
        
        // Fallback text version for email clients that don't support HTML
        const text = `Hi ${user.name}, your password reset OTP is ${otp}. It expires in 10 minutes.`; 
        
        // Beautiful HTML version
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset Request 🔐</h2>
                <p>Hi ${user.name}, we received a request to reset your password. Please use the following One-Time Password (OTP):</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px;">
                    <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
                </div>
                <p style="color: #555; font-size: 12px; margin-top: 20px;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
        `;

        // Send the email and handle failures
        try {
            await sendEmail(email, subject, text, html);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        return res.status(200).json({ message: 'An OTP has been sent to your email address.' });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to process password reset",
            error: error.message
        });
    }
};


// Step 2: User submits the OTP and their new password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const normalizedOtp = String(otp).trim();

        // 1. Find user by email and verify OTP matches AND hasn't expired
        const user = await User.findOne({
            email,
            resetPasswordOtp: normalizedOtp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = await hashPassword(newPassword);

        // 3. Clear the OTP fields so they can't be used again
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password has been successfully reset"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to reset password",
            error: error.message
        });
    }
};