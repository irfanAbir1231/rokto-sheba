export type BloodRequest = {
  _id: string;
  patientName: string;
  bloodGroup: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  bagsNeeded: number;
  neededBy: string;
  contactNumber: string;
  patientImage?: string;
  medicalReport?: string;
  additionalInfo?: string;
  isPending: boolean; // New field
  requestedBy: {
    firstName: string;
    lastName: string;
    clerkID: string; // New field for ownership check
    imageURL?: string;
  };
  createdAt: string;
};

// Add this new Review type
export type Review = {
  _id: string;
  rating: number;
  comment?: string;
  bloodRequest: string; // BloodRequest ID
  user: {
    firstName: string;
    lastName: string;
    imageURL?: string;
  };
  createdAt: string;
};