import { useState } from 'react';
import { Card, Button, Badge } from '../ui';
import { MOCK_TECHNICIANS } from '../../lib/mock/data';
import { Star, CheckCircle2, ChevronRight, User, Calendar, Settings } from 'lucide-react';

interface TechnicianDashboardProps {
  onLogout: () => void;
}

export function TechnicianDashboard({ onLogout }: TechnicianDashboardProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'profile'>('jobs');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  
  // Mock login as the first technician
  const tech = MOCK_TECHNICIANS[0];

  // Mock Jobs for the dashboard
  const [jobs, setJobs] = useState([
    {
      id: 'BK-48291',
      customer: 'John Doe',
      address: '123 Main St, Apt 4B',
      appliance: 'Washing Machine',
      issue: 'Worn or Broken Drive Belt / Motor Coupling',
      time: 'Today, 8AM - 12PM',
      status: 'assigned',
      partsStrategy: 'technician'
    },
    {
      id: 'BK-15932',
      customer: 'Alice Smith',
      address: '456 Oak Ave',
      appliance: 'Refrigerator',
      issue: 'Failing Compressor or Condenser Fan Motor',
      time: 'Today, 12PM - 4PM',
      status: 'completed',
      partsStrategy: 'inspection'
    }
  ]);

  const updateJobStatus = (jobId: string, newStatus: string) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
  };

  const activeJob = jobs.find(j => j.id === selectedJob);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">{tech.name}</h1>
              <p className="text-xs text-slate-500 mt-0.5">ID: {tech.id} • Tech Portal</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="text-sm py-1.5 border-none hover:bg-slate-100">
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => { setActiveTab('jobs'); setSelectedJob(null); }}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            My Jobs
          </button>
          <button 
            onClick={() => { setActiveTab('profile'); setSelectedJob(null); }}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Profile & Stats
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{tech.name}</h2>
                  <p className="text-slate-500">Senior Technician • {tech.id}</p>
                </div>
                <div className="flex items-center text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <Star className="w-4 h-4 fill-current mr-1.5" />
                  <span className="font-bold">{tech.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="text-sm text-slate-500 mb-1">Total Jobs</div>
                  <div className="text-2xl font-bold text-slate-900">{tech.jobsCompleted}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="text-sm text-slate-500 mb-1">Today's Route</div>
                  <div className="text-2xl font-bold text-slate-900">4</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="text-sm text-slate-500 mb-1">On-Time %</div>
                  <div className="text-2xl font-bold text-slate-900">98%</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="text-sm text-slate-500 mb-1">Parts Ready</div>
                  <div className="text-2xl font-bold text-slate-900">92%</div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-slate-900 mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {tech.specialization.map(spec => (
                    <span key={spec} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Jobs List Tab */}
        {activeTab === 'jobs' && !selectedJob && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Today's Schedule</h2>
            
            {jobs.map(job => (
              <Card 
                key={job.id} 
                className={`p-0 overflow-hidden cursor-pointer hover:border-blue-300 transition-colors ${job.status === 'completed' ? 'opacity-75 bg-slate-50' : ''}`}
                onClick={() => setSelectedJob(job.id)}
              >
                <div className={`p-4 flex flex-col md:flex-row md:items-center justify-between border-l-4 ${job.status === 'completed' ? 'border-l-slate-400' : job.status === 'in_progress' ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
                  
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <Badge variant={job.status === 'completed' ? 'default' : 'default'} className={job.status === 'completed' ? 'bg-slate-200 text-slate-700' : 'bg-blue-100 text-blue-800'}>
                        {job.time.split(',')[1]}
                      </Badge>
                      <span className="text-xs font-mono text-slate-500">{job.id}</span>
                      <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded" style={{
                        background: job.status === 'completed' ? '#f1f5f9' : job.status === 'in_progress' ? '#fef3c7' : '#e0e7ff',
                        color: job.status === 'completed' ? '#64748b' : job.status === 'in_progress' ? '#b45309' : '#3730a3'
                      }}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-slate-900">{job.customer} - {job.appliance}</h3>
                    <p className="text-sm text-slate-600 mt-1 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> {job.address}
                    </p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-slate-400 hidden md:block" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Active Job Detail */}
        {activeTab === 'jobs' && selectedJob && activeJob && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <button 
              onClick={() => setSelectedJob(null)}
              className="text-sm text-slate-500 hover:text-slate-900 flex items-center"
            >
              <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Back to Schedule
            </button>
            
            <Card className="p-6 border-t-4 border-t-blue-600">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{activeJob.appliance} Repair</h2>
                  <p className="text-slate-500 font-mono text-sm mt-1">{activeJob.id}</p>
                </div>
                <Badge variant={activeJob.status === 'completed' ? 'success' : 'default'} className="uppercase">
                  {activeJob.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Customer</div>
                    <div className="font-medium text-slate-900">{activeJob.customer}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Time Window</div>
                    <div className="font-medium text-slate-900">{activeJob.time}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Address</div>
                    <div className="font-medium text-slate-900">{activeJob.address}</div>
                  </div>
                </div>
              </div>

              <div className="mb-8 space-y-4">
                <h3 className="font-semibold text-slate-900 border-b pb-2">Diagnostic Information</h3>
                
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  <div className="text-sm font-semibold text-blue-900 mb-1">AI Diagnosis</div>
                  <p className="text-slate-800">{activeJob.issue}</p>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                  <div className="text-sm font-semibold text-amber-900 mb-1">Parts Strategy: {activeJob.partsStrategy.toUpperCase()}</div>
                  <p className="text-amber-800 text-sm">
                    {activeJob.partsStrategy === 'technician' ? 'Ensure you have the likely required parts from the warehouse before heading out.' : 'Inspect the unit thoroughly before ordering any parts. Customer will pay for parts later.'}
                  </p>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-semibold text-slate-900 mb-4">Update Status</h3>
                
                {activeJob.status === 'completed' ? (
                  <div className="flex items-center text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <span className="font-medium">Job marked as completed.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => updateJobStatus(activeJob.id, 'on_the_way')}
                      className={`border-none w-full ${activeJob.status === 'on_the_way' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      On the Way
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => updateJobStatus(activeJob.id, 'arrived')}
                      className={`border-none w-full ${activeJob.status === 'arrived' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Arrived
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => updateJobStatus(activeJob.id, 'in_progress')}
                      className={`border-none w-full ${activeJob.status === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      In Progress
                    </Button>
                    <Button 
                      onClick={() => updateJobStatus(activeJob.id, 'completed')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Complete Job
                    </Button>
                  </div>
                )}
                
                {activeJob.status === 'completed' && (
                  <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
                     <p className="font-semibold text-slate-700 mb-2 flex items-center"><Settings className="w-4 h-4 mr-2"/> Work Log Recorded</p>
                     <p className="text-slate-600">Replaced drive belt and tested spin cycle. Operations normal. Final cost: $145.</p>
                  </div>
                )}
              </div>

            </Card>
          </div>
        )}

      </main>
    </div>
  );
}