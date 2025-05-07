import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/config";
import User from "@/lib/models/User";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    
    // Extract filter parameters
    const bloodGroup = searchParams.get("bloodGroup");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius");
    
    // Base query - only get users with complete profiles
    let query = User.find({ isUpdated: true });
    
    // Apply blood group filter if specified
    if (bloodGroup) {
      query = query.where("bloodGroup").equals(bloodGroup);
    }
    
    // Apply location filter if coordinates and radius are specified
    if (lat && lng && radius) {
      query = query.where("address.location").near({
        center: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)],
        },
        maxDistance: Number(radius), // in meters
        spherical: true,
      });
    }
    
    // Execute query with projection to limit returned fields
    const donors = await query
      .select("firstName lastName bloodGroup address imageURL phone dob")
      .lean()
      .exec();
    
    // Transform the data for client use
    const transformedDonors = donors.map(donor => ({
      id: donor._id ? donor._id.toString() : '',
      name: `${donor.firstName} ${donor.lastName}`,
      bloodGroup: donor.bloodGroup,
      location: donor.address.name,
      coordinates: donor.address.location.coordinates,
      imageURL: donor.imageURL || "/default-avatar.png",
      phone: donor.phone,
      dob: donor.dob ? donor.dob.toISOString() : null,
    }));
    
    return NextResponse.json(transformedDonors);
    
  } catch (error) {
    console.error("Error fetching donors:", error);
    return NextResponse.json(
      { message: "Failed to fetch donors" },
      { status: 500 }
    );
  }
};