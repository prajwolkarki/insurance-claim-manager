import crypto from "crypto";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mail";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  try {
    // Parse the email from the request body
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before saving to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save the hashed token and expiry time
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save({ validateBeforeSave: false });

    // Create the reset URL - use the unhashed token in the URL
    const resetUrl = `${process.env.DOMAIN}/resetpassword?token=${resetToken}`;

    // Email content
    const emailContent = `
      Hello,
      
      You requested a password reset for your account. Click the link below to reset your password:
      
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this reset, please ignore this email.
      
      Best regards,
      Your App Team
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: emailContent,
      });

      return NextResponse.json(
        { 
          message: "Password reset email sent",
          success: true 
        },
        { status: 200 }
      );
    } catch (emailError) {
      // If email fails, remove the token from database
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
      await user.save({ validateBeforeSave: false });

      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { 
        error: "An error occurred during password reset",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}