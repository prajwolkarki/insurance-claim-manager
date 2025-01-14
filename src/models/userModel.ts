
import mongoose from "mongoose";
// Define the schema for the user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please provide a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [8, "Password must be at least 8 characters long"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyCode: String,
    verifyCodeExpiry: Date
});
const User = mongoose.models.users || mongoose.model("users", userSchema);


export default User;
