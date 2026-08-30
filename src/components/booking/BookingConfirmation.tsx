import { Card, Button, Badge } from '../ui';
import { mockTechnicians } from '../../lib/mock/technicians';
import { CheckCircle2, Download, Calendar, MapPin, Wrench, Home } from 'lucide-react';
import type { DiagnosisResult, ApplianceType } from '../../lib/diagnosis';

interface BookingConfirmationProps {
  booking: any;
  diagnosis: DiagnosisResult;
  partsDecision: string;
  appliance: ApplianceType;
  complaint: string;
  onNewDiagnosis: () => void;
}

export function BookingConfirmation({ booking, diagnosis, partsDecision, appliance, complaint, onNewDiagnosis }: BookingConfirmationProps) {
  const tech = mockTechnicians.find(t => t.id === booking.technicianId);

  const handleDownload = () => {
    // Generate a simple text file for the demo
    const content = `
FIXFLOW BOOKING CONFIRMATION
============================
Booking ID: ${booking.bookingId}
Status: Confirmed

CUSTOMER DETAILS
Address: ${booking.serviceAddress}

APPOINTMENT
Date: ${booking.preferredDate}
Time: ${booking.preferredTime}
Technician: ${tech?.name} (${tech?.phone})

REPAIR DETAILS
Appliance: ${appliance}
Complaint: ${complaint}
Diagnosis: ${diagnosis.likelyIssue}
Parts Strategy: ${partsDecision === 'technician' ? 'Technician brings parts' : partsDecision === 'customer' ? 'Customer provides parts' : 'Inspection first'}
Est. Cost: ${diagnosis.estimatedCostRange}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FixFlow-Booking-${booking.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h2>
        <p className="text-slate-600 text-lg">Your repair has been successfully scheduled.</p>
        <Badge variant="success" className="text-lg px-4 py-1">ID: {booking.bookingId}</Badge>
      </div>

      <Card className="p-8 border-t-4 border-t-blue-600 shadow-lg mt-8 bg-white">
        
        {/* Tech Info */}
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
           {tech && <img src={tech.avatar} alt={tech.name} className="w-16 h-16 rounded-full border border-slate-200" />}
           <div>
             <h3 className="text-lg font-bold text-slate-900">{tech?.name}</h3>
             <p className="text-slate-500">Your assigned technician</p>
           </div>
           <div className="ml-auto text-right">
             <div className="text-sm font-medium text-slate-900">{tech?.phone}</div>
             <div className="text-xs text-slate-500">Contact Number</div>
           </div>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-100">
           <div>
             <div className="flex items-center text-slate-500 mb-1">
               <Calendar className="w-4 h-4 mr-2" />
               <span className="text-xs font-medium uppercase tracking-wider">Date & Time</span>
             </div>
             <div className="font-semibold text-slate-900">{booking.preferredDate}</div>
             <div className="text-slate-600">{booking.preferredTime}</div>
           </div>
           <div>
             <div className="flex items-center text-slate-500 mb-1">
               <MapPin className="w-4 h-4 mr-2" />
               <span className="text-xs font-medium uppercase tracking-wider">Service Address</span>
             </div>
             <div className="font-semibold text-slate-900">{booking.serviceAddress}</div>
           </div>
        </div>

        {/* Job Details */}
        <div className="py-6 space-y-4">
           <div className="flex items-center text-slate-500 mb-2">
             <Wrench className="w-4 h-4 mr-2" />
             <span className="text-xs font-medium uppercase tracking-wider">Repair Summary</span>
           </div>
           
           <div className="bg-slate-50 p-4 rounded-lg space-y-3">
             <div className="flex justify-between">
               <span className="text-slate-600">Appliance</span>
               <span className="font-medium text-slate-900">{appliance}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-600">Diagnosis</span>
               <span className="font-medium text-slate-900">{diagnosis.likelyIssue}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-600">Parts Strategy</span>
               <span className="font-medium text-slate-900 capitalize">{partsDecision}</span>
             </div>
             <div className="flex justify-between pt-3 border-t border-slate-200">
               <span className="font-medium text-slate-900">Estimated Cost</span>
               <span className="font-bold text-blue-600">{diagnosis.estimatedCostRange}</span>
             </div>
           </div>
        </div>

      </Card>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button onClick={handleDownload} variant="outline" className="flex-1 py-4">
          <Download className="w-5 h-5 mr-2" />
          Download Details
        </Button>
        <Button onClick={onNewDiagnosis} className="flex-1 py-4">
          <Home className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}