export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialization: string[];
  rating: number;
  jobsCompleted: number;
  availability: 'today' | 'tomorrow' | 'this_week';
}

export const MOCK_TECHNICIANS: Technician[] = [
  {
    id: 'TECH-8201',
    name: 'Michael Rodriguez',
    phone: '(555) 234-5678',
    specialization: ['Refrigerator', 'Air Conditioner'],
    rating: 4.9,
    jobsCompleted: 342,
    availability: 'today'
  },
  {
    id: 'TECH-1934',
    name: 'Sarah Jenkins',
    phone: '(555) 876-5432',
    specialization: ['Washing Machine', 'Television'],
    rating: 4.8,
    jobsCompleted: 215,
    availability: 'tomorrow'
  },
  {
    id: 'TECH-4492',
    name: 'David Chen',
    phone: '(555) 345-6789',
    specialization: ['Air Conditioner', 'Other'],
    rating: 4.7,
    jobsCompleted: 189,
    availability: 'this_week'
  }
];

export interface BookingDetails {
  bookingId: string;
  customerName: string;
  serviceAddress: string;
  preferredDate: string;
  preferredTime: string;
  technicianId: string;
  status: 'booked' | 'assigned' | 'on_the_way' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  workPerformed?: string;
  partsUsed?: string;
  finalCost?: string;
  technicianNotes?: string;
  customerRating?: number;
  customerComment?: string;
}
