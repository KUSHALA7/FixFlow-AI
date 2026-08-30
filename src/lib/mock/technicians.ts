export interface Technician {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  rating: number;
  reviews: number;
  experience: string;
  specialization: string[];
  serviceArea: string;
  availability: string;
}

export const mockTechnicians: Technician[] = [
  {
    id: "tech-1",
    name: "Michael Rodriguez",
    avatar: "https://i.pravatar.cc/150?u=tech1",
    phone: "(555) 123-4567",
    rating: 4.9,
    reviews: 124,
    experience: "8 years",
    specialization: ["Washing Machine", "Refrigerator"],
    serviceArea: "Downtown & Westside",
    availability: "Available Today"
  },
  {
    id: "tech-2",
    name: "Sarah Jenkins",
    avatar: "https://i.pravatar.cc/150?u=tech2",
    phone: "(555) 987-6543",
    rating: 4.7,
    reviews: 89,
    experience: "5 years",
    specialization: ["Air Conditioner", "Refrigerator"],
    serviceArea: "North Hills",
    availability: "Available Tomorrow"
  },
  {
    id: "tech-3",
    name: "David Chen",
    avatar: "https://i.pravatar.cc/150?u=tech3",
    phone: "(555) 456-7890",
    rating: 4.8,
    reviews: 210,
    experience: "12 years",
    specialization: ["All Appliances", "Television"],
    serviceArea: "Metro Area",
    availability: "Available Today"
  }
];