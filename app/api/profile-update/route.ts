import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/config";
import User from "@/lib/models/User";

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Get the current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      address,
      nidNumber, 
      bloodGroup,
      dob,
      hbsAgReport,
      vdrlReport,
      antiHcvReport,
      cbcReport,
    } = body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !nidNumber ||
      !bloodGroup ||
      !dob
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const client = await clerkClient();

    try {
      await client.users.updateUser(user.id, {
        firstName,
        lastName,
      });
    } catch (err) {
      console.error("Error updating Clerk user:", err);
      return NextResponse.json(
        { success: false, message: "Failed to update Clerk user profile" },
        { status: 500 }
      );
    }

    // Create or update the user in the database
    const updatedUser = await User.findOneAndUpdate(
      { clerkID: user.id }, // Filter by Clerk User ID
      {
        clerkID: user.id,
        firstName,
        lastName,
        phone,
        address,
        nidNumber,
        imageURL: user.imageUrl, // Clerk user profile image
        bloodGroup,
        dob,
        isUpdated: true,
        hbsAgReport: hbsAgReport || null,
        vdrlReport: vdrlReport || null,
        antiHcvReport: antiHcvReport || null,
        cbcReport: cbcReport || null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true } // Create if not exists
    );

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/profile-update:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
