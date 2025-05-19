import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/config";
import BloodRequest from "@/lib/models/BloodRequest";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/User";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await connectDB();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ clerkID: userId });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const bloodRequest = await BloodRequest.findById((await params).id).populate(
      "requestedBy"
    );

    if (!bloodRequest)
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );

    // Check ownership
    if (bloodRequest.requestedBy._id.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { isPending } = await req.json();

    bloodRequest.isPending = isPending;
    await bloodRequest.save();

    return NextResponse.json(bloodRequest);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
