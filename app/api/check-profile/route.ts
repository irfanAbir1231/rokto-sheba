import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/config";
import User from "@/lib/models/User";
import { auth } from "@clerk/nextjs/server";

export const GET = async () => {
  await connectDB();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const user = await User.findOne({ clerkID: userId });

    if (!user) {
      return NextResponse.json(
        { message: "Profile not found", isUpdated: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        isUpdated: user.isUpdated,
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          bloodGroup: user.bloodGroup,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile verification failed:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
