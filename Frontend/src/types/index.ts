export interface Event {
  _id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  icon: string;
  fee: number;
  prize: string;
  teamType: string;
  minTeam: number;
  maxTeam: number;
  rounds: { name: string; description: string }[];
  whatsappLink: string;
  isActive: boolean;
  order: number;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
  category: string;
  isActive: boolean;
  order: number;
}

export interface Award {
  _id: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: string;
  color: string;
  prize: string;
  order: number;
  isActive: boolean;
}

export interface Domain {
  _id: string;
  title: string;
  desc: string;
  badge: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

export interface Registration {
  _id: string;
  userId?: string;
  eventId: string;
  eventName?: string;
  teamType?: string;
  teamName?: string;
  teamMembers?: { name: string; rollNumber: string }[];
  name: string;
  email: string;
  mobileNumber: string;
  college: string;
  rollNumber?: string;
  upiId: string;
  transactionId: string;
  paymentReceiptUrl: string;
  status: "pending" | "confirmed" | "rejected";
  createdAt: string;
  emailSentAt?: string;
  sheetSyncedAt?: string;
}
