import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/config";
import User from "@/lib/models/User";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const clerkID = searchParams.get("clerkID"); // Use clerkID as parameter

    if (!clerkID) {
      return NextResponse.json(
        { success: false, message: "Clerk ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ clerkID }); // Use clerkID to find the user

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        dob: user.dob,
        address: user.address,
        isUpdated: user.isUpdated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
