import * as z from "zod"

const otpSchema = z.union([
    z.string(),
    z.number()
]).transform((value) => String(value).trim()).refine((value) => /^\d{6}$/.test(value), {
    message: "OTP must be 6 digits"
})

export const registerUserSchema = z.object({
    name: z.string().min(2).max(50),
    lastname: z.string().min(2).max(50),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(4, "minimum of 4 characters").max(128),
    role: z.string().optional(),
}).strict()

export const loginUserSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(4).max(128),
}).strict()

export const changePasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    oldPassword: z.string().min(12).max(128),
    newPassword: z.string().min(12).max(128)
}).strict()

export const forgotPasswordSchema = z.object({
     email: z.string().trim().toLowerCase().email()
}).strict()

export const resetPasswordSchema = z.object({
     email: z.string().trim().toLowerCase().email(),
    otp: otpSchema,
    newPassword: z.string().min(12).max(128),
}).strict()

export const verifyEmailSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    otp: otpSchema,
}).strict()
