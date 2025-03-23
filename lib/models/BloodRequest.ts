import mongoose, { Schema, Document } from "mongoose";

export interface BloodRequestDocument extends Document {
  patientName: string;
  bloodGroup: string;
  location: {
    address: string; // Human-readable address from Barikoi
    coordinates: [number, number]; // [longitude, latitude]
  };
  bagsNeeded: number;
  neededBy: Date;
  contactNumber: string;
  patientImage?: string;
  medicalReport?: string;
  additionalInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BloodRequestSchema = new Schema<BloodRequestDocument>(
  {
    patientName: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    location: {
      address: { type: String, required: true },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (v: number[]) => v.length === 2,
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
    },
    bagsNeeded: { type: Number, required: true, min: 1 },
    neededBy: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    patientImage: { type: String },
    medicalReport: { type: String },
    additionalInfo: { type: String },
  },
  { timestamps: true }
);

// geospatial index for nearest donor searches
BloodRequestSchema.index({ "location.coordinates": "2dsphere" });

const BloodRequest =
  mongoose.models.BloodRequest ||
  mongoose.model<BloodRequestDocument>("BloodRequest", BloodRequestSchema);

export default BloodRequest;
