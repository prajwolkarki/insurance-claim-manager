import { NextRequest, NextResponse } from "next/server";
import Claim from "@/models/claimModel";
import { connect } from "@/dbConfig/dbConfig";
connect();
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { document } = await req.json();

  if (!document)
    return NextResponse.json(
      { error: "Document is required" },
      { status: 400 }
    );

  try {
    const claim = await Claim.findById(params.id);
    if (!claim)
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });

    claim.documents.push(document);
    await claim.save();

    return NextResponse.json(
      { message: "Document uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
