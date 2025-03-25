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
  additionalInfo?: string;
  patientImage?: string;
  medicalReport?: string;
  createdAt: string;
  updatedAt: string;
};
