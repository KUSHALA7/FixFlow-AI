import { useState } from 'react';
import { Card, Button, Badge } from '../ui';
import { mockTechnicians, type Technician } from '../../lib/mock/technicians';
import { Star, MapPin, Calendar, Clock, CheckCircle2, ChevronRight, User } from 'lucide-react';
import type { ApplianceType } from '../../lib/diagnosis';

interface TechnicianBookingProps {
  appliance: ApplianceType;
  onBook: (details: { technician: Technician, date: string, time: string, address: string }) => void;
}

export function TechnicianBooking({ appliance, onBook }: TechnicianBookingProps) {
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // Get tomorrow's date for default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Mock available times
  const timeSlots = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

  const handleBook = () => {
    if (selectedTech && date && time && address) {
      onBook({
        technician: selectedTech,
        date,
        time,
        address
      });
    }
  };

  // Filter technicians based on appliance (mock logic - all can do all for now, but sort by rating)
  const availableTechs = [...mockTechnicians].sort((a, b) => b.rating - a.rating);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Select a Technician</h2>
        <p className="text-slate-600 mt-2">Choose an available professional to repair your {appliance}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Tech Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Available Professionals
          </h3>
          
          <div className="space-y-3">
            {availableTechs.map(tech => (
              <Card 
                key={tech.id} 
                className={`p-4 cursor-pointer transition-all border-2 ${selectedTech?.id === tech.id ? 'border-blue-600 bg-blue-50/50' : 'border-transparent hover:border-blue-200'}`}
                onClick={() => setSelectedTech(tech)}
              >
                <div className="flex items-start space-x-4">
                  <img src={tech.avatar} alt={tech.name} className="w-16 h-16 rounded-full object-cover border border-slate-200" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900">{tech.name}</h4>
                      <Badge variant="success" className="text-xs">{tech.availability}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-amber-500 mt-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium ml-1">{tech.rating}</span>
                      <span className="text-slate-500 ml-1">({tech.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 mt-2">
                      <WrenchIcon className="w-3 h-3 mr-1" />
                      {tech.experience} exp
                      <span className="mx-2">•</span>
                      <MapPin className="w-3 h-3 mr-1" />
                      {tech.serviceArea}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Scheduling */}
        <div className="space-y-6">
          <Card className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Schedule Appointment
            </h3>

            <div className="space-y-4 flex-1">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, Apt 4B"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={tomorrowStr}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Time</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`py-2 text-sm rounded-md border transition-colors flex items-center justify-center ${
                        time === slot 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500'
                      }`}
                    >
                      <Clock className="w-3 h-3 mr-1.5" /> {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <Button 
                className="w-full py-4 text-base shadow-lg"
                disabled={!selectedTech || !date || !time || !address}
                onClick={handleBook}
              >
                {selectedTech ? `Book ${selectedTech.name.split(' ')[0]}` : 'Select Technician to Book'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              {!selectedTech || !date || !time || !address ? (
                <p className="text-center text-xs text-slate-500 mt-3">Please complete all fields to continue</p>
              ) : (
                <p className="text-center text-xs text-green-600 mt-3 flex items-center justify-center font-medium">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Ready to book
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Simple internal icon since we can't import easily
function WrenchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}
