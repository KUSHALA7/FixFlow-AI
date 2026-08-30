export interface User {
  id: string;
  role: 'customer' | 'technician';
  name: string;
  email?: string;
  phone: string;
  address?: string;
  rating?: number;
  experience?: string;
  serviceArea?: string;
  specializations?: string[];
  availability?: string;
  avatar?: string;
}

export interface Booking {
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  technicianId: string;
  technicianName: string;
  technicianPhone: string;
  appliance: string;
  complaint: string;
  aiDiagnosis: string;
  confidence: number;
  possibleCauses: string[];
  partsStrategy: string;
  estimatedCost: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: string;
  status: 'CONFIRMED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  technicianNotes?: string;
  completedAt?: string;
  rating?: number;
  feedback?: string;
}

export const USERS: User[] = [
  {
    id: 'cust-1',
    role: 'customer',
    name: 'Ananya Sharma',
    email: 'ananya@example.com',
    phone: '9876543212',
    address: '123 Palm Grove, Block A',
  },
  {
    id: 'tech-1',
    role: 'technician',
    name: 'Rajesh Kumar',
    phone: '9876543210',
    rating: 4.8,
    experience: '8 years',
    serviceArea: 'North Zone',
    specializations: ['Washing Machine', 'Refrigerator'],
    availability: 'Available Today',
    avatar: 'https://i.pravatar.cc/150?u=rajesh'
  },
  {
    id: 'tech-2',
    role: 'technician',
    name: 'Priya Nair',
    phone: '9876543211',
    rating: 4.9,
    experience: '5 years',
    serviceArea: 'South Zone',
    specializations: ['Air Conditioner', 'Washing Machine'],
    availability: 'Available Tomorrow',
    avatar: 'https://i.pravatar.cc/150?u=priya'
  }
];

const STORAGE_KEYS = {
  USERS: 'fixflow_users',
  SESSION: 'fixflow_session',
  BOOKINGS: 'fixflow_bookings',
};

// Initialize store with demo data if empty
export const initializeStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
  }
};

export const getSession = (): User | null => {
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  return session ? JSON.parse(session) : null;
};

export const setSession = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

export const getBookings = (): Booking[] => {
  const bookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return bookings ? JSON.parse(bookings) : [];
};

export const saveBooking = (booking: Booking) => {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.bookingId === bookingId);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }
};
