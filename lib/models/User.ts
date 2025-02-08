import mongoose, { Schema, Document } from "mongoose";

export interface Address {
  name: string; // Human-readable address
  location: {
    type: "Point"; // GeoJSON type
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface UserDocument extends Document {
  clerkID: string; // Clerk User ID
  firstName: string;
  lastName: string;
  phone: string;
  nidNumber: string; 
  address: Address; // Address with geospatial data
  imageURL: string; // Profile image URL
  bloodGroup: string;
  dob: Date;
  isUpdated: boolean;
  hbsAgReport?: string; 
  vdrlReport?: string;  
  antiHcvReport?: string; 
  cbcReport?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<Address>({
  name: { type: String, required: true, trim: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

const UserSchema = new Schema<UserDocument>(
  {
    clerkID: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    nidNumber: { type: String, required: true, unique: true, trim: true }, 
    address: { type: AddressSchema, required: true },
    imageURL: { type: String, required: false, trim: true },
    bloodGroup: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    isUpdated: { type: Boolean, default: false },
    hbsAgReport: { type: String, required: false, trim: true },
    vdrlReport: { type: String, required: false, trim: true }, 
    antiHcvReport: { type: String, required: false, trim: true },
    cbcReport: { type: String, required: false, trim: true }, 
  },
  { timestamps: true }
);

// Create a geospatial index on the address location
UserSchema.index({ "address.location": "2dsphere" });

const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
export default User;

