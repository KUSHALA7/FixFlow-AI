import { Card, Badge, Button } from '../ui';
import type { BookingDetails } from '../../lib/mock/data';
import type { DiagnosisResult, PartsDecision } from '../../lib/diagnosis';
import { CheckCircle2, Calendar, Clock, MapPin, User, Phone, Download, ChevronRight } from 'lucide-react';
import { MOCK_TECHNICIANS } from '../../lib/mock/data';
import { useRef } from 'react';

interface BookingConfirmationProps {
  booking: BookingDetails;
  diagnosis: DiagnosisResult;
  partsDecision: PartsDecision;
  appliance: string;
  complaint: string;
  onNewDiagnosis: () => void;
}

export function BookingConfirmation({ 
  booking, 
  diagnosis, 
  partsDecision, 
  appliance, 
  complaint,
  onNewDiagnosis 
}: BookingConfirmationProps) {
  
  const tech = MOCK_TECHNICIANS.find(t => t.id === booking.technicianId);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!cardRef.current) return;
    
    // Very basic HTML to string download approach to keep dependencies low
    // We just trigger print of the styled content.
    // The htmlContent isn't strictly needed for the window.open approach,
    // but the cardRef is there for structure.
    
    // Minimal CSS for print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Booking Card - ${booking.bookingId}</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; line-height: 1.5; }
              .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
              .header { border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px; }
              .header h1 { margin: 0; color: #1e40af; font-size: 24px; }
              .header p { margin: 4px 0 0; color: #64748b; font-size: 14px; }
              .section { margin-bottom: 24px; }
              .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 8px; font-weight: 600; }
              .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
              .data-item label { display: block; font-size: 12px; color: #64748b; }
              .data-item span { font-weight: 500; }
              .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
              .status { display: inline-block; padding: 4px 8px; background: #dcfce7; color: #166534; border-radius: 4px; font-size: 12px; font-weight: 600; }
              @media print {
                body { padding: 0; background: white; }
                .card { box-shadow: none; border: none; max-width: 100%; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <h1>FixFlow Service Card</h1>
                <p>Booking Ref: ${booking.bookingId}</p>
              </div>
              
              <div class="section">
                <div class="section-title">Status</div>
                <div class="status">CONFIRMED</div>
              </div>

              <div class="section">
                <div class="section-title">Service Details</div>
                <div class="data-grid">
                  <div class="data-item"><label>Date</label><span>${booking.preferredDate}</span></div>
                  <div class="data-item"><label>Time</label><span>${booking.preferredTime}</span></div>
                  <div class="data-item"><label>Customer</label><span>${booking.customerName}</span></div>
                  <div class="data-item"><label>Address</label><span>${booking.serviceAddress}</span></div>
                </div>
              </div>

              <div class="section box">
                <div class="section-title">Appliance & Issue</div>
                <p style="margin:0 0 8px;"><strong>${appliance}</strong></p>
                <p style="margin:0 0 8px; font-style: italic; color: #475569; font-size: 14px;">"${complaint}"</p>
                <p style="margin:0; font-size: 14px;"><strong>Diagnosis:</strong> ${diagnosis.likelyIssue}</p>
              </div>

              <div class="section">
                <div class="section-title">Technician</div>
                <div class="data-grid">
                  <div class="data-item"><label>Name</label><span>${tech?.name || 'Assigned Tech'}</span></div>
                  <div class="data-item"><label>Tech ID</label><span>${tech?.id || 'N/A'}</span></div>
                  <div class="data-item"><label>Phone</label><span>${tech?.phone || 'N/A'}</span></div>
                </div>
              </div>

              <div class="section box" style="background: #eff6ff; border-color: #bfdbfe;">
                <div class="section-title" style="color: #1e40af;">Repair Plan</div>
                <div class="data-grid">
                  <div class="data-item"><label>Est. Cost</label><span>${diagnosis.estimatedCostRange}</span></div>
                  <div class="data-item"><label>Parts Strategy</label><span>${partsDecision === 'customer' ? 'Customer Supplied' : partsDecision === 'technician' ? 'Tech Supplied' : 'Inspect First'}</span></div>
                </div>
              </div>
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 text-center bg-green-50/50 border-green-200">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-600 mb-4">
          Your technician has been scheduled. Your booking reference is <strong className="text-slate-900">{booking.bookingId}</strong>.
        </p>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          
          {/* Printable Area Reference */}
          <div ref={cardRef} className="hidden">
            {/* Kept hidden, used for raw string extraction if needed, but we use string template above for cleaner print styles */}
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between items-center">
              Appointment Details
              <Badge variant="success">Confirmed</Badge>
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-500">Date</div>
                  <div className="font-medium text-slate-900">{booking.preferredDate}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-500">Time Window</div>
                  <div className="font-medium text-slate-900">{booking.preferredTime}</div>
                </div>
              </div>
              <div className="flex items-start sm:col-span-2">
                <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-500">Service Address</div>
                  <div className="font-medium text-slate-900">{booking.serviceAddress}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-medium text-slate-900 mb-1">{appliance} Issue</h4>
              <p className="text-sm text-slate-600 italic mb-2">"{complaint}"</p>
              <div className="flex items-center text-sm">
                <span className="font-medium text-slate-700 mr-2">Diagnosis:</span>
                <span className="text-slate-600">{diagnosis.likelyIssue}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-4 border-b pb-2">Technician</h3>
            {tech && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{tech.name}</div>
                    <div className="text-xs text-slate-500">ID: {tech.id}</div>
                  </div>
                </div>
                
                <a href={`tel:${tech.phone}`} className="flex items-center justify-center w-full py-2 px-4 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  <Phone className="w-4 h-4 mr-2 text-slate-500" />
                  {tech.phone}
                </a>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-blue-600 text-white border-none">
            <h3 className="text-lg font-semibold mb-2">Est. Cost</h3>
            <div className="text-3xl font-bold mb-1">{diagnosis.estimatedCostRange}</div>
            <p className="text-blue-100 text-xs mb-4">
              Parts strategy: {partsDecision === 'customer' ? 'Customer Supplied' : partsDecision === 'technician' ? 'Tech Supplied' : 'Inspect First'}
            </p>
            
            <Button 
              variant="outline" 
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 transition-colors"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Save Booking Card
            </Button>
          </Card>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={onNewDiagnosis} className="border-none hover:bg-slate-100">
          Start New Diagnosis <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}