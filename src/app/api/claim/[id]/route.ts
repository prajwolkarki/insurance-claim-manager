import { NextRequest, NextResponse } from "next/server";
import Claim from "@/models/claimModel";
import { connect } from "@/dbConfig/dbConfig";
connect();
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const claim = await Claim.findById(params.id);
    if (!claim) return NextResponse.json({ error: "Claim not found" }, { status: 404 });

    return NextResponse.json({ claim }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch claim" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {status} = await req.json();
    const updatedClaim = await Claim.findByIdAndUpdate(params.id, {status});
    if(!updatedClaim) return NextResponse.json({error: "Claim not found"}, {status: 404});

    return NextResponse.json({ message: "Claim updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update claim" }, { status: 500 });
  }
}
