import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import crypto from "crypto";
connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    //console.log(reqBody);

    //check user exits
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    //hashing password

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // console.log(hashedPassword);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const otp = crypto.randomBytes(3).toString('hex'); 
    newUser.verifyCode = otp;
    newUser.verifyCodeExpiry = Date.now() + 3600000; 
    await newUser.save();
    await sendVerificationEmail(email,username, otp);
    return NextResponse.json(
      { message: "User created Successfully", sucess: true, newUser },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
