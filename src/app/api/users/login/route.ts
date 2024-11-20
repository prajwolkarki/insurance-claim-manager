import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();


export async function POST(request:NextRequest){
    try{
        const reqBody = await request.json();
       //console.log(reqBody);
        const {email,password,rememberMe} = reqBody;
        const user = await User.findOne({email})
       // console.log(user)
        if(!user){
            return NextResponse.json({error: "User not found"},{status: 404});
        }
        //check password
        const isMatch = await bcryptjs.compare(password,user.password);
        if(!isMatch){
            return NextResponse.json({error: "Invalid credentials"},{status: 401});
        }
        //generate token
        const tokenData = {
            id: user._id,
            username:user.username,
            email:user.email,
        };

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!,{expiresIn:"7d"}); 
        
        const response = NextResponse.json({ message: "Login Successful", success: true }, { status: 200 });
        
        const expiryTime = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000; 
        const expiryDate = new Date(Date.now() + expiryTime);
        
        response.cookies.set("token", token, {
          httpOnly: true,
          expires: expiryDate, 
          
        });
        
        return response;
            

    }catch(error: any){
        return NextResponse.json({error: error.message},{status: 500});
    }
}