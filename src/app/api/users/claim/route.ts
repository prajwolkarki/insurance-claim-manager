// app/api/claim/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import Claim from "@/models/claimModel";
import {connect} from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
connect();
export async function GET(req: Request) {
    try {
      const claims = await Claim.find(); 
      return NextResponse.json({ claims }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
    }
  }
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const claimType = formData.get("claimType") as string;
    const amount = formData.get("amount") as string;
    const documents = formData.getAll("documents") as File[];

    const token = request.cookies.get("token")?.value || "";
    console.log(token);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
    
    

    // Validate the input
    if (!claimType || !amount || documents.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file types and sizes
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of documents) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPG, PNG and PDF files are allowed" },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "File size too large. Maximum size is 5MB" },
          { status: 400 }
        );
      }
    }
    const savedDocuments:string[] = [];
    for(const file of documents){
        const bufferBytes = await file.arrayBuffer();
        const buffer = Buffer.from(bufferBytes);
        const filePath = `public/uploads/${file.name}`;
        await writeFile(filePath,buffer);
        savedDocuments.push(filePath);
    }
    const claim = new Claim({
        claimant: (decoded as {username: string}).username.toString(),
        claimType,
        amount,
        documents: savedDocuments,
    });
    await claim.save();
    return NextResponse.json({ message: "Claim submitted successfully 👍👍👍",claim });


  } catch (error) {
    console.error("Error processing claim:", error);
    return NextResponse.json(
      { error: "Error processing claim submission" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};