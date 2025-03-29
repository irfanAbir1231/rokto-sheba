// Review.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ReviewDocument extends Document {
  user: Schema.Types.ObjectId;
  bloodRequest: Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bloodRequest: {
      type: Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const Review =
  mongoose.models.Review ||
  mongoose.model<ReviewDocument>("Review", ReviewSchema);
export default Review;
