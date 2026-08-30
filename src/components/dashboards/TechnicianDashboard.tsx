import { useState } from 'react';
import { Card, Button, Badge } from '../ui';
import { MapPin, Phone, CheckCircle2, ChevronRight, LogOut, Wrench, AlertCircle } from 'lucide-react';
import { mockTechnicians } from '../../lib/mock/technicians';

// Mock active job data
const mockJob = {
  id: 'BK-48291',
  customer: {
    name: 'John Doe',
    phone: '(555) 111-2222',
    address: '123 Main St, Apt 4B'
  },
  appliance: 'Washing Machine',
  complaint: 'Stops mid-cycle and beeps 3 times.',
  diagnosis: {
    issue: 'Faulty Door Latch Assembly',
    confidence: 85,
    estimatedCost: '$150 - $250'
  },
  partsStrategy: 'technician',
  status: 'assigned', // assigned, en_route, in_progress, completed
  scheduledFor: 'Today, 02:00 PM'
};

interface TechnicianDashboardProps {
  onLogout: () => void;
}

export function TechnicianDashboard({ onLogout }: TechnicianDashboardProps) {
  const [jobStatus, setJobStatus] = useState(mockJob.status);
  const [activeTab, setActiveTab] = useState<'details' | 'diagnosis'>('details');

  // Assume Tech 1 is logged in
  const tech = mockTechnicians[0];

  const handleStatusUpdate = (newStatus: string) => {
    setJobStatus(newStatus);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'assigned': return <Badge variant="warning">New Job</Badge>;
      case 'en_route': return <Badge variant="info">On the Way</Badge>;
      case 'in_progress': return <Badge variant="warning">In Progress</Badge>;
      case 'completed': return <Badge variant="success">Completed</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
               <img src={tech.avatar} alt="Tech" className="w-full h-full object-cover" />
             </div>
             <div>
               <h1 className="text-sm font-bold leading-none">{tech.name}</h1>
               <p className="text-xs text-slate-400 mt-0.5">FixFlow Technician Portal</p>
             </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="text-xs py-1 px-2 h-auto text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white">
            <LogOut className="w-3 h-3 mr-1.5" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Active Job</h2>
            <p className="text-sm text-slate-500">{mockJob.scheduledFor}</p>
          </div>
          {getStatusBadge(jobStatus)}
        </div>

        <Card className="overflow-hidden shadow-md border-0 mb-6">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-700 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Job Details
            </button>
            <button 
              onClick={() => setActiveTab('diagnosis')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'diagnosis' ? 'border-b-2 border-blue-600 text-blue-700 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
              AI Diagnosis
            </button>
          </div>

          <div className="p-5">
            {activeTab === 'details' ? (
              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Information</h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <div className="font-medium text-slate-900">{mockJob.customer.name}</div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" /> {mockJob.customer.phone}
                    </div>
                    <div className="flex items-start text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400 mt-0.5" /> {mockJob.customer.address}
                    </div>
                  </div>
                </div>

                {/* Issue Info */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Reported Issue</h3>
                  <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                    <div className="font-medium text-slate-900">{mockJob.appliance}</div>
                    <p className="text-sm text-slate-600 italic">"{mockJob.complaint}"</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                 {/* AI Analysis */}
                 <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1.5" /> FixFlow Analysis
                  </h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-4">
                    <div>
                      <div className="text-xs text-blue-600 font-medium mb-1">Likely Issue ({mockJob.diagnosis.confidence}% Confidence)</div>
                      <div className="font-bold text-slate-900 text-lg">{mockJob.diagnosis.issue}</div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-blue-100">
                      <span className="text-sm text-slate-600">Estimated Quote</span>
                      <span className="font-bold text-slate-900">{mockJob.diagnosis.estimatedCost}</span>
                    </div>
                  </div>
                </div>

                {/* Strategy */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Agreed Strategy</h3>
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <Wrench className="w-5 h-5 text-slate-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-slate-900 capitalize">
                        {mockJob.partsStrategy === 'technician' ? 'Technician Provides Parts' : mockJob.partsStrategy === 'customer' ? 'Customer Has Parts' : 'Inspection Required First'}
                      </div>
                      <div className="text-xs text-slate-500">Ensure you have common parts for {mockJob.diagnosis.issue}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-3">
            {jobStatus === 'assigned' && (
              <Button onClick={() => handleStatusUpdate('en_route')} className="w-full py-4 text-base shadow-sm">
                Accept & Start Route <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            )}
            
            {jobStatus === 'en_route' && (
              <Button onClick={() => handleStatusUpdate('in_progress')} className="w-full py-4 text-base bg-amber-500 hover:bg-amber-600 text-white shadow-sm">
                Arrived & Start Work <Wrench className="w-5 h-5 ml-1.5" />
              </Button>
            )}

            {jobStatus === 'in_progress' && (
              <Button onClick={() => handleStatusUpdate('completed')} className="w-full py-4 text-base bg-green-600 hover:bg-green-700 text-white shadow-sm">
                Mark Job Completed <CheckCircle2 className="w-5 h-5 ml-1.5" />
              </Button>
            )}

            {jobStatus === 'completed' && (
              <div className="text-center py-2 text-green-600 font-medium flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Job Successfully Completed
              </div>
            )}
          </div>
        </Card>

      </main>
    </div>
  );
}