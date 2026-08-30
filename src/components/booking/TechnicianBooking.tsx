import { useState } from 'react';
import { Button, Card, Badge } from '../ui';
import { Calendar, Clock, MapPin, User, Star, ChevronRight } from 'lucide-react';
import { MOCK_TECHNICIANS } from '../../lib/mock/data';
import type { Technician } from '../../lib/mock/data';

interface TechnicianBookingProps {
  onBook: (details: { technician: Technician, date: string, time: string, address: string }) => void;
  appliance: string;
}

export function TechnicianBooking({ onBook, appliance }: TechnicianBookingProps) {
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // Filter technicians based on appliance specialization
  const availableTechs = MOCK_TECHNICIANS.filter(tech => 
    tech.specialization.includes(appliance) || tech.specialization.includes('Other')
  ).slice(0, 3); // Max 3

  // Use all if filter is too strict
  const techsToShow = availableTechs.length > 0 ? availableTechs : MOCK_TECHNICIANS.slice(0, 3);

  const dates = [
    { label: 'Today', value: new Date().toISOString().split('T')[0] },
    { label: 'Tomorrow', value: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
    { label: 'Next Week', value: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] }
  ];

  const timeSlots = ['Morning (8AM - 12PM)', 'Afternoon (12PM - 4PM)', 'Evening (4PM - 8PM)'];

  const handleConfirm = () => {
    if (selectedTech && date && time && address) {
      onBook({
        technician: selectedTech,
        date,
        time,
        address
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Book a Technician</h2>
      
      <div className="space-y-8">
        
        {/* Step 1: Select Technician */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2">1</span>
            Select Available Technician
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {techsToShow.map(tech => (
              <div 
                key={tech.id}
                onClick={() => setSelectedTech(tech)}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedTech?.id === tech.id 
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{tech.name}</h4>
                      <div className="flex items-center text-xs text-slate-500 space-x-2">
                         <span>ID: {tech.id}</span>
                         <span>•</span>
                         <span className="flex items-center text-amber-500">
                           <Star className="w-3 h-3 fill-current mr-1" />
                           {tech.rating} ({tech.jobsCompleted} jobs)
                         </span>
                      </div>
                    </div>
                  </div>
                  {tech.availability === 'today' && (
                    <Badge variant="success" className="text-xs py-0">Fastest</Badge>
                  )}
                </div>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {tech.specialization.map(spec => (
                    <span key={spec} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Date & Time */}
        <div className={`transition-opacity duration-300 ${!selectedTech ? 'opacity-50 pointer-events-none' : ''}`}>
           <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2">2</span>
            Schedule Appointment
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> Date
              </label>
              <div className="flex flex-col gap-2">
                {dates.map(d => (
                  <button
                    key={d.value}
                    onClick={() => setDate(d.value)}
                    className={`py-2 px-3 text-sm text-left rounded-lg border transition-colors ${
                      date === d.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {d.label} <span className="text-xs opacity-75 ml-2">({d.value})</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" /> Time Window
              </label>
              <div className="flex flex-col gap-2">
                {timeSlots.map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`py-2 px-3 text-sm text-left rounded-lg border transition-colors ${
                      time === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Address */}
        <div className={`transition-opacity duration-300 ${(!date || !time) ? 'opacity-50 pointer-events-none' : ''}`}>
           <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2">3</span>
            Service Address
          </h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address (e.g. 123 Main St, Apt 4B)"
              className="pl-10 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Confirm Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button 
            className="px-6 py-2 text-lg"
            disabled={!selectedTech || !date || !time || !address}
            onClick={handleConfirm}
          >
            Confirm Booking <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

      </div>
    </Card>
  );
}
