import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/config";
import User from "@/lib/models/User";
import cloudinary from "@/lib/cloudinary/cloudinary";

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

    // Parse the request body as FormData
    const formData = await request.formData();

    // Extract fields from FormData
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const nidNumber = formData.get("nidNumber") as string;
    const address = JSON.parse(formData.get("address") as string);
    const bloodGroup = formData.get("bloodGroup") as string;
    const dob = formData.get("dob") as string;
    const avatar = formData.get("imageURL") as File | null;
    const hbsAgReport = formData.get("hbsAgReport") as File | null;
    const vdrlReport = formData.get("vdrlReport") as File | null;
    const antiHcvReport = formData.get("antiHcvReport") as File | null;
    const cbcReport = formData.get("cbcReport") as File | null;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !nidNumber ||
      !address ||
      !bloodGroup ||
      !dob
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Upload files to Cloudinary
    const uploadFile = async (file: File) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "auto", folder: "RoktoSheba" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result?.secure_url || "");
              }
            }
          )
          .end(buffer);
      });
    };

    const avatarUrl = avatar ? await uploadFile(avatar) : user.imageUrl;
    const hbsAgReportUrl = hbsAgReport ? await uploadFile(hbsAgReport) : null;
    const vdrlReportUrl = vdrlReport ? await uploadFile(vdrlReport) : null;
    const antiHcvReportUrl = antiHcvReport
      ? await uploadFile(antiHcvReport)
      : null;
    const cbcReportUrl = cbcReport ? await uploadFile(cbcReport) : null;

    const client = await clerkClient();

    try {
      await client.users.updateUser(user.id, {
        firstName,
        lastName,
      });

      if (avatar) {
        await client.users.updateUserProfileImage(user.id, {
          file: avatar,
        });
      }
    } catch (err) {
      console.error("Error updating Clerk user:", err);
      return NextResponse.json(
        { success: false, message: "Failed to update Clerk user profile" },
        { status: 500 }
      );
    }

    // Create or update the user in the database
    const updatedUser = await User.findOneAndUpdate(
      { clerkID: user.id },
      {
        clerkID: user.id,
        firstName,
        lastName,
        phone,
        nidNumber,
        address,
        imageURL: avatarUrl,
        bloodGroup,
        dob,
        isUpdated: true,
        hbsAgReport: hbsAgReportUrl,
        vdrlReport: vdrlReportUrl,
        antiHcvReport: antiHcvReportUrl,
        cbcReport: cbcReportUrl,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
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
