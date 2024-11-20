
import mongoose from "mongoose";
// Define the schema for the user
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Please provide a username"],
        unique: true
    },
    email:{
        type: String,
        required: [true, "Please provide an email"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Please provide a password"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    provider: {
        type: String,
        default: "credentials", 
      },
      providerId: {
        type: String,
      },
      image: {
        type: String, 
      },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyCode: String,
    verifyCodeExpiry: Date
});
const User = mongoose.models.users || mongoose.model("users", userSchema);


export default User;