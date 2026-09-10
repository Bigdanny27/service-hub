import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }, 
    avatar: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: [ "admin", "provider", "customer"],
        default: "customer"
    },
    isActive: {
        type: Boolean,
        default: true
    },
     isVerified:{
        type: Boolean,
        default: false

    },
    verificationOtp: {
        type: Number
    },
    verificationOtpExpires: {
        type: Date
    },
    resetPasswordOtp: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User