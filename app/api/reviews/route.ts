import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/config";
import Review from "@/lib/models/Review";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/User";

export const POST = async (req: NextRequest) => {
  await connectDB();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ clerkID: userId });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { bloodRequestId, rating, comment } = await req.json();

    const newReview = new Review({
      user: user._id,
      bloodRequest: bloodRequestId,
      rating,
      comment,
    });

    await newReview.save();
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
