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
  requestedBy: {
    firstName: string;
    lastName: string;
    imageURL?: string;
  };
  createdAt: string;
};
