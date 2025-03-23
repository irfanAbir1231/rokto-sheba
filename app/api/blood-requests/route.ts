// app/api/blood-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/config";
import BloodRequest from "@/lib/models/BloodRequest";
import { BloodRequestDocument } from "@/lib/models/BloodRequest";
import cloudinary from "@/lib/cloudinary/cloudinary";

export const POST = async (req: NextRequest) => {
  await connectDB();

  try {
    const formData = await req.formData();

    // Extract text fields
    const patientName = formData.get("patientName") as string;
    const bloodGroup = formData.get("bloodGroup") as string;
    const location = JSON.parse(formData.get("location") as string);
    const bagsNeeded = Number(formData.get("bagsNeeded"));
    const neededBy = new Date(formData.get("neededBy") as string);
    const contactNumber = formData.get("contactNumber") as string;
    const additionalInfo = (formData.get("additionalInfo") as string) || "";

    // Handle file uploads
    const patientImageFile = formData.get("patientImage") as File | null;
    const medicalReportFile = formData.get("medicalReport") as File | null;

    let patientImageUrl = "";
    let medicalReportUrl = "";

    // Upload patient image
    if (patientImageFile) {
      const arrayBuffer = await patientImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "blood-requests" }, (error, result) => {
            if (error) reject(error);
            resolve(result);
          })
          .end(buffer);
      });
      patientImageUrl = (result as any).secure_url;
    }

    // Upload medical report
    if (medicalReportFile) {
      const arrayBuffer = await medicalReportFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "medical-reports" }, (error, result) => {
            if (error) reject(error);
            resolve(result);
          })
          .end(buffer);
      });
      medicalReportUrl = (result as any).secure_url;
    }

    // Validate required fields
    if (
      !patientName ||
      !bloodGroup ||
      !location ||
      !bagsNeeded ||
      !neededBy ||
      !contactNumber
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new blood request
    const bloodRequest: BloodRequestDocument = new BloodRequest({
      patientName,
      bloodGroup,
      location: {
        address: location.address,
        coordinates: location.coordinates,
      },
      bagsNeeded,
      neededBy,
      contactNumber,
      additionalInfo,
      patientImage: patientImageUrl,
      medicalReport: medicalReportUrl,
    });

    await bloodRequest.save();

    return NextResponse.json(bloodRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating blood request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
