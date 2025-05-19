// app/api/blood-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/config";
import BloodRequest from "@/lib/models/BloodRequest";
import { BloodRequestDocument } from "@/lib/models/BloodRequest";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { auth } from "@clerk/nextjs/server";
import User from "@/lib/models/User";

// Define a type for Cloudinary upload result
interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: unknown; // For other properties that might be in the result
}

export const POST = async (req: NextRequest) => {
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
        { message: "Please complete your profile first" },
        { status: 403 }
      );
    }

    // Check if user has completed profile updates
    if (!user.isUpdated) {
      return NextResponse.json(
        { message: "Please update your profile information" },
        { status: 403 }
      );
    }

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
      patientImageUrl = (result as CloudinaryUploadResult).secure_url;
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
      medicalReportUrl = (result as CloudinaryUploadResult).secure_url;
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
      requestedBy: user._id,
      isPending: true,
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

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Base query with population
    let query = BloodRequest.find().populate({
      path: "requestedBy",
      select: "firstName lastName imageURL createdAt clerkID",
    });

    const userId = searchParams.get("userId");
    if (userId) {
      // Find the user document using Clerk ID
      const user = await User.findOne({ clerkID: userId });
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      query = query.where("requestedBy").equals(user._id);
    }

    // 1. Blood Group Filter
    const bloodGroup = searchParams.get("bloodGroup");
    if (bloodGroup) {
      query = query.where("bloodGroup").equals(bloodGroup);
    }

    // 2. Quantity Filter
    const minBags = searchParams.get("minBags");
    const maxBags = searchParams.get("maxBags");
    if (minBags) query = query.where("bagsNeeded").gte(Number(minBags));
    if (maxBags) query = query.where("bagsNeeded").lte(Number(maxBags));

    // 3. Location-based Filter
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius");
    if (lat && lng && radius) {
      query = query.where("location.coordinates").near({
        center: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)],
        },
        maxDistance: Number(radius),
        spherical: true,
      });
    }

    // 4. Date Filters
    const minDate = searchParams.get("minDate");
    const maxDate = searchParams.get("maxDate");
    if (minDate)
      query = query.where("neededBy").gte(new Date(minDate).getTime());
    if (maxDate)
      query = query.where("neededBy").lte(new Date(maxDate).getTime());

    // 5. Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const sortOptions: { [key: string]: 1 | -1 } = {};
    const allowedSortFields = ["createdAt", "neededBy", "bagsNeeded"];

    if (allowedSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder;
      // Secondary sort for urgency
      if (sortBy === "neededBy") {
        sortOptions.createdAt = -1;
      }
    }

    query = query.sort(sortOptions);

    // Execute query
    const requests = await query.select("-__v -updatedAt").lean().exec();

    const transformedRequests = requests.map((request) => ({
      ...request,
      createdAt: request.createdAt.toISOString(),
      requestedBy: {
        firstName: request.requestedBy.firstName,
        lastName: request.requestedBy.lastName,
        imageURL: request.requestedBy.imageURL,
        clerkID: request.requestedBy.clerkID,
      },
    }));

    return NextResponse.json(transformedRequests, { status: 200 });
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    return NextResponse.json(
      { message: "Failed to fetch blood requests" },
      { status: 500 }
    );
  }
};
