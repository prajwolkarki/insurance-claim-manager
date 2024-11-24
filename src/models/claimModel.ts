import mongoose, { Schema, Document, Model } from "mongoose";


export interface IClaim extends Document {
  claimant: string; 
  claimType: string; 
  amount: number;
  status: string; 
  documents: string[]; 
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for claims
const ClaimSchema: Schema = new Schema<IClaim>(
  {
    claimant: {
      type: String,
      ref: "User", 
      required: true,
    },
    claimType: {
      type: String,
      required: true,
      enum: ["OPD", "Hospitalized", "Dental", "Eye Checkup"], 
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "New",
      enum: ["New", "Assigned", "In-review", "Rejected", "Approved", "Completed"],
    },
    documents: {
      type: [String], 
      default: [],
    },
  },
  {
    timestamps: true, 
  }
);
 const Claim: Model<IClaim> =  mongoose.models.claims || mongoose.model<IClaim>("claims", ClaimSchema);

 export default Claim;
