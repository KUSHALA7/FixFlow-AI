import { Card, Button } from '../ui';
import { CheckCircle2, MapPin, Calendar, DollarSign, Wrench, Download } from 'lucide-react';
import type { ApplianceType, DiagnosisResult } from '../../lib/diagnosis';

interface BookingConfirmationProps {
  booking: any;
  diagnosis: DiagnosisResult;
  partsDecision: string;
  appliance: ApplianceType;
  complaint: string;
  onNewDiagnosis: () => void;
}

export function BookingConfirmation({ booking, diagnosis, partsDecision, appliance, complaint }: BookingConfirmationProps) {
  
  const handleDownload = () => {
    // Simple mock download
    const content = `
FIXFLOW REPAIR BOOKING
======================
Booking ID: ${booking.bookingId}
Status: CONFIRMED

CUSTOMER DETAILS
Name: ${booking.customerName}
Address: ${booking.serviceAddress}

APPLIANCE ISSUE
Appliance: ${appliance}
Complaint: ${complaint}

AI DIAGNOSIS
Likely Issue: ${diagnosis.likelyIssue} (Confidence: ${diagnosis.confidence}%)
Parts Strategy: ${partsDecision}
Estimated Cost: ${diagnosis.estimatedCostRange}

TECHNICIAN DETAILS
Name: ${booking.technicianName}
Phone: ${booking.technicianPhone}
Appointment: ${booking.preferredDate} at ${booking.preferredTime}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FixFlow_Booking_${booking.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-600">Your technician has been scheduled successfully.</p>
      </div>

      <Card id="booking-card" className="p-0 overflow-hidden shadow-lg border-slate-200 mb-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-sm mb-1">Booking ID</p>
            <p className="font-mono text-xl font-bold tracking-wider">{booking.bookingId}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
              ● Confirmed
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8 bg-white">
          
          {/* Schedule */}
          <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-slate-100">
            <div className="flex-1 flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Date & Time</p>
                <p className="font-bold text-slate-900">{booking.preferredDate}</p>
                <p className="text-slate-600">{booking.preferredTime}</p>
              </div>
            </div>
            <div className="flex-1 flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Service Address</p>
                <p className="font-medium text-slate-900 leading-snug">{booking.serviceAddress}</p>
              </div>
            </div>
          </div>

          {/* Technician */}
          <div className="pb-6 border-b border-slate-100">
            <h3 className="text-sm text-slate-500 mb-4 uppercase tracking-wider font-semibold">Assigned Technician</h3>
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                   <img src={`https://i.pravatar.cc/150?u=${booking.technicianId}`} alt="Tech" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{booking.technicianName}</p>
                  <p className="text-sm text-slate-500">{booking.technicianPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis Summary */}
          <div>
            <h3 className="text-sm text-slate-500 mb-4 uppercase tracking-wider font-semibold">Job Summary</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Wrench className="w-5 h-5 text-slate-400 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">{appliance} Issue</p>
                  <p className="text-sm text-slate-600 mt-1">{diagnosis.likelyIssue}</p>
                </div>
              </div>
              <div className="flex items-start">
                <DollarSign className="w-5 h-5 text-slate-400 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Estimated Cost</p>
                  <p className="text-sm text-slate-600 mt-1">{diagnosis.estimatedCostRange}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Card>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="outline" onClick={handleDownload} className="py-3 px-6">
          <Download className="w-4 h-4 mr-2" /> Download Job Card
        </Button>
        <Button onClick={() => window.location.reload()} className="py-3 px-6">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
