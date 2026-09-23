import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import hashPassword from "../utils/hashPass.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/email.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const registerUserService = async ({ name, lastname, email, password, role, avatar = "" }) => {
  if (!name || !lastname || !email || !password) {
    throw makeError("name, lastname, email and password are required", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw makeError("user already exists", 409);
  }

  const hashedUserPassword = await hashPassword(password);
  const otp = Math.floor(100000 + Math.random() * 900000);

  const user = await User.create({
    name,
    lastname,
    email,
    password: hashedUserPassword,
    role,
    avatar,
    verificationOtp: otp,
    verificationOtpExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  return {
    statusCode: 201,
    message: "user successfully created",
    user,
  };
};

export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw makeError("email and password are required", 400);
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw makeError("user not found", 404);
  }

  const isCorrectPassword = await bcrypt.compare(password, existingUser.password);
  if (!isCorrectPassword) {
    throw makeError("incorrect password", 401);
  }

  const token = await generateToken(existingUser._id);

  return {
    statusCode: 200,
    message: "user login successful",
    token,
    user: email,
  };
};

export const logoutUserService = async () => ({
  statusCode: 200,
  message: "Logout successful",
});

export const changePasswordService = async ({ email, oldPassword, newPassword }) => {
  if (!email || !oldPassword || !newPassword) {
    throw makeError("email, oldPassword and newPassword are required", 400);
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw makeError("User not found", 404);
  }

  const isOldPasswordCorrect = await bcrypt.compare(oldPassword, existingUser.password);
  if (!isOldPasswordCorrect) {
    throw makeError("Invalid old password", 401);
  }

  const hashedNewPassword = await hashPassword(newPassword);
  existingUser.password = hashedNewPassword;
  await existingUser.save();

  return {
    statusCode: 200,
    message: "Password changed successfully",
  };
};

export const verifyEmailService = async ({ email, otp }) => {
  const normalizedOtp = String(otp).trim();

  const user = await User.findOne({ email });
  if (!user) {
    throw makeError("User not found", 404);
  }
  if (user.isVerified) {
    throw makeError("Email is already verified", 400);
  }
  if (!user.verificationOtp) {
    throw makeError("No verification OTP found", 400);
  }
  if (user.verificationOtpExpires < new Date()) {
    throw makeError("OTP has expired", 400);
  }
  if (String(user.verificationOtp) !== normalizedOtp) {
    throw makeError("Invalid OTP", 400);
  }

  user.isVerified = true;
  user.verificationOtp = undefined;
  user.verificationOtpExpires = undefined;
  await user.save();

  return {
    statusCode: 200,
    message: "Email verified successfully",
  };
};

export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw makeError("email is not register", 404);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const subject = "Event-hub - Password Reset Request";
  const text = `Hi ${user.name}, your password reset OTP is ${otp}. It expires in 10 minutes.`;
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

  try {
    await sendEmail(email, subject, text, html);
  } catch (emailError) {
    throw makeError("Failed to send OTP email", 500);
  }

  return {
    statusCode: 200,
    message: "An OTP has been sent to your email address.",
  };
};

export const resetPasswordService = async ({ email, otp, newPassword }) => {
  const normalizedOtp = String(otp).trim();

  const user = await User.findOne({
    email,
    resetPasswordOtp: normalizedOtp,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw makeError("Invalid or expired OTP", 400);
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return {
    statusCode: 200,
    message: "Password has been successfully reset",
  };
};
