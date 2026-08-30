import { useState } from 'react';
import { analyzeComplaint, calculateReadinessScore } from './lib/diagnosis';
import type { ApplianceType, WorkflowState } from './lib/diagnosis';
import { Button, Card, Badge, Input } from './components/ui';
import { TechnicianJobCard } from './components/JobCard';
import { TechnicianBooking } from './components/booking/TechnicianBooking';
import { BookingConfirmation } from './components/booking/BookingConfirmation';
import { TechnicianDashboard } from './components/dashboards/TechnicianDashboard';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard';
import { CustomerRating } from './components/booking/CustomerRating';
import { Wrench, CheckCircle2, ChevronRight, Activity, RotateCcw, AlertTriangle, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';

const APPLIANCES: ApplianceType[] = ['Washing Machine', 'Refrigerator', 'Air Conditioner', 'Television', 'Other'];
const EXAMPLES = [
  "My washing machine makes a grinding noise and won't spin.",
  "My refrigerator is running but not getting cold.",
  "My AC is running but the room isn't cooling."
];

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'customerLogin' | 'technicianLogin' | 'customer' | 'technician' | 'rating' | 'booking'>('landing');
  const [state, setState] = useState<WorkflowState>({
    appliance: null,
    complaint: '',
    isAnalyzing: false,
    diagnosis: null,
    partsDecision: null,
    bookingDetails: null,
    repairStatus: null
  });

  const readinessScore = calculateReadinessScore(state.appliance, state.complaint);

  const handleAnalyze = () => {
    if (!state.appliance || !state.complaint.trim()) return;

    setState(s => ({ ...s, isAnalyzing: true }));
    
    // Simulate API delay
    setTimeout(() => {
      const diagnosis = analyzeComplaint(state.appliance!, state.complaint);
      setState(s => ({ ...s, isAnalyzing: false, diagnosis }));
    }, 1500);
  };

  const handleBookTechnician = (details: any) => {
    // Generate mock booking ID
    const bookingId = `BK-${Math.floor(Math.random() * 90000) + 10000}`;
    
    setState(s => ({
      ...s,
      bookingDetails: {
        bookingId,
        customerName: 'Guest Customer', // In real app, from auth
        serviceAddress: details.address,
        preferredDate: details.date,
        preferredTime: details.time,
        technicianId: details.technician.id,
        status: 'booked'
      }
    }));
  };

  const reset = () => {
    setState({
      appliance: null,
      complaint: '',
      isAnalyzing: false,
      diagnosis: null,
      partsDecision: null,
      bookingDetails: null,
      repairStatus: null
    });
  };

  const getStage = () => {
    if (state.bookingDetails) return 6; // Confirmation
    if (state.repairStatus === 'booking') return 5; // Booking Form
    if (state.partsDecision) return 4; // Job Card
    if (state.diagnosis) return 3; // Diagnosis
    if (state.isAnalyzing) return 2; // Analyzing
    return 1; // Input
  };

  const currentStage = getStage();

  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-10">
          <div className="bg-blue-600 p-4 rounded-2xl inline-block mb-6">
            <Wrench className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">FIXFLOW LANDING PAGE</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">FixFlow</h2>
          <p className="text-slate-500 text-lg">AI Repair Companion</p>
        </div>

        <Card className="p-8 max-w-md w-full shadow-lg border-slate-200">
          <h3 className="text-xl font-medium text-center text-slate-800 mb-6">"Who are you?"</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => setViewMode('customerLogin')} className="py-6 text-lg" variant="outline">
              Customer
            </Button>
            <Button onClick={() => setViewMode('technicianLogin')} className="py-6 text-lg" variant="outline">
              Technician
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (viewMode === 'customerLogin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full shadow-lg border-slate-200">
          <h2 className="text-2xl font-bold text-center mb-6">Customer Login</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name/Email</label>
              <Input type="text" placeholder="Enter name or email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <Input type="password" placeholder="Enter password" />
            </div>
            <Button onClick={() => setViewMode('customer')} className="w-full">Login</Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-300" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or</span></div>
            </div>
            <Button onClick={() => setViewMode('customer')} variant="secondary" className="w-full">Demo Customer Login</Button>
            <Button onClick={() => setViewMode('landing')} variant="ghost" className="w-full mt-2">Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (viewMode === 'technicianLogin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full shadow-lg border-slate-200">
          <h2 className="text-2xl font-bold text-center mb-6">Technician Login</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone/Email</label>
              <Input type="text" placeholder="Enter phone or email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <Input type="password" placeholder="Enter password" />
            </div>
            <Button onClick={() => setViewMode('technician')} className="w-full">Login</Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-300" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or</span></div>
            </div>
            <Button onClick={() => setViewMode('technician')} variant="secondary" className="w-full">Demo Technician Login</Button>
            <Button onClick={() => setViewMode('landing')} variant="ghost" className="w-full mt-2">Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (viewMode === 'technician') {
    return <TechnicianDashboard onLogout={() => setViewMode('landing')} />;
  }

  if (viewMode === 'customer') {
    return <CustomerDashboard onLogout={() => setViewMode('landing')} onBookRepair={() => setViewMode('booking')} />;
  }

  if (viewMode === 'rating') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <CustomerRating 
          technicianName="Michael Rodriguez" 
          appliance="Washing Machine"
          onSubmit={() => setViewMode('customer')}
          onSkip={() => setViewMode('customer')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none tracking-tight">FixFlow</h1>
              <p className="text-xs text-slate-500 mt-0.5">AI Repair Companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setViewMode('rating')} className="hidden sm:flex text-xs py-1 px-2 h-auto text-slate-500 border-none hover:bg-slate-100">
                Simulate Rating
              </Button>
              <Button variant="outline" onClick={() => setViewMode('customer')} className="text-sm py-1.5 hidden sm:flex border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700">
                Back to Dashboard
              </Button>
            {currentStage > 1 && (
              <Button variant="outline" onClick={reset} className="text-sm py-1.5">
                <RotateCcw className="w-4 h-4 mr-2" /> Start New
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro */}
        {currentStage === 1 && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Turn appliance problems into clear repair plans.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Describe the issue, and our AI engine will diagnose the likely cause, estimate costs, and prepare a structured job card for a technician.
            </p>
          </div>
        )}

        {/* Workflow Progress */}
        {currentStage > 1 && currentStage < 6 && (
          <div className="flex items-center justify-center space-x-2 md:space-x-4 text-sm font-medium overflow-x-auto pb-2">
            <span className={`flex items-center whitespace-nowrap ${currentStage >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
               <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-current mr-2 text-xs">1</span>
               Input
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            <span className={`flex items-center whitespace-nowrap ${currentStage >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
               <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-current mr-2 text-xs">2</span>
               Analysis
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            <span className={`flex items-center whitespace-nowrap ${currentStage >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
               <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-current mr-2 text-xs">3</span>
               Decision
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            <span className={`flex items-center whitespace-nowrap ${currentStage >= 4 ? 'text-blue-600' : 'text-slate-400'}`}>
               <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-current mr-2 text-xs">4</span>
               Job Card
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            <span className={`flex items-center whitespace-nowrap ${currentStage >= 5 ? 'text-blue-600' : 'text-slate-400'}`}>
               <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-current mr-2 text-xs">5</span>
               Booking
            </span>
          </div>
        )}

        {/* Stage 1: Input */}
        {currentStage === 1 && (
          <div className="grid md:grid-cols-[2fr_1fr] gap-6">
            <Card className="p-6 shadow-md border-slate-200">
              <h3 className="text-lg font-semibold mb-4">1. What needs fixing?</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Appliance</label>
                  <div className="flex flex-wrap gap-2">
                    {APPLIANCES.map(app => (
                      <button
                        key={app}
                        onClick={() => setState(s => ({ ...s, appliance: app }))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          state.appliance === app 
                            ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Describe the Problem</label>
                  <textarea
                    value={state.complaint}
                    onChange={(e) => setState(s => ({ ...s, complaint: e.target.value }))}
                    placeholder="e.g., The washing machine stops mid-cycle and beeps 3 times..."
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                  />
                  
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-slate-500">Try an example:</p>
                    <div className="flex flex-col gap-2">
                      {EXAMPLES.map((ex, i) => (
                        <button 
                          key={i}
                          onClick={() => {
                            const app = ex.includes('washing') ? 'Washing Machine' : ex.includes('refrigerator') ? 'Refrigerator' : 'Air Conditioner';
                            setState(s => ({ ...s, complaint: ex, appliance: app }));
                          }}
                          className="text-left text-sm text-blue-600 hover:text-blue-800 bg-blue-50/50 hover:bg-blue-50 px-3 py-2 rounded border border-blue-100 transition-colors"
                        >
                          "{ex}"
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full py-3 text-base shadow-md" 
                  disabled={!state.appliance || !state.complaint.trim()}
                  onClick={handleAnalyze}
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Analyze Problem
                </Button>
              </div>
            </Card>

            {/* Readiness Sidebar */}
            <div className="space-y-4">
              <Card className="p-5 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-900">Repair Readiness</h4>
                  <span className="text-2xl font-bold text-blue-600">{readinessScore}%</span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${readinessScore < 50 ? 'bg-amber-500' : readinessScore < 80 ? 'bg-blue-500' : 'bg-green-500'}`} 
                    style={{ width: `${readinessScore}%` }}
                  ></div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <div className={`mt-0.5 mr-2 ${state.appliance ? 'text-green-500' : 'text-slate-300'}`}>
                      {state.appliance ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                    </div>
                    <span className={state.appliance ? 'text-slate-700' : 'text-slate-500'}>Appliance identified</span>
                  </div>
                  <div className="flex items-start">
                    <div className={`mt-0.5 mr-2 ${state.complaint.length > 10 ? 'text-green-500' : 'text-slate-300'}`}>
                      {state.complaint.length > 10 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                    </div>
                    <span className={state.complaint.length > 10 ? 'text-slate-700' : 'text-slate-500'}>Detailed symptoms provided</span>
                  </div>
                </div>

                {readinessScore < 100 && (
                  <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                    <span>Providing more details about noises, leaks, or when the problem started helps improve accuracy.</span>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Stage 2: Loading Analysis */}
        {currentStage === 2 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-slate-900">Analyzing symptoms...</h3>
              <p className="text-slate-500 text-sm animate-pulse">Matching repair patterns across {state.appliance}s</p>
            </div>
          </div>
        )}

        {/* Stage 3: Diagnosis & Parts Decision */}
        {currentStage === 3 && state.diagnosis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-6 border-green-200 bg-green-50/30">
               <div className="flex items-start justify-between">
                 <div>
                    <Badge variant="success" className="mb-3">Analysis Complete</Badge>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      Likely Issue: {state.diagnosis.likelyIssue}
                    </h2>
                    <p className="text-slate-600 mb-4">
                      Based on your description, we are {state.diagnosis.confidence}% confident this is the root cause.
                    </p>
                 </div>
                 <div className="text-right">
                    <div className="text-sm text-slate-500 mb-1">Est. Cost</div>
                    <div className="text-xl font-bold text-slate-900">{state.diagnosis.estimatedCostRange}</div>
                 </div>
               </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">How would you like to handle parts?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                
                <button 
                  onClick={() => setState(s => ({ ...s, partsDecision: 'technician' }))}
                  className="p-4 border border-slate-200 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center mb-3 transition-colors">
                    <Wrench className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-1">Technician Arranges</h4>
                  <p className="text-sm text-slate-500">Fastest option. Tech brings likely parts.</p>
                </button>

                <button 
                  onClick={() => setState(s => ({ ...s, partsDecision: 'customer' }))}
                  className="p-4 border border-slate-200 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center mb-3 transition-colors">
                    <DollarSign className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-1">I'll Buy Parts</h4>
                  <p className="text-sm text-slate-500">Save money. Tech just installs them.</p>
                </button>

                <button 
                  onClick={() => setState(s => ({ ...s, partsDecision: 'inspection' }))}
                  className="p-4 border border-slate-200 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center mb-3 transition-colors">
                    <AlertCircle className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-1">Inspect First</h4>
                  <p className="text-sm text-slate-500">Safest. Verify issue before any parts.</p>
                </button>

              </div>
            </Card>
          </div>
        )}

        {/* Stage 4: Job Card */}
        {currentStage === 4 && state.diagnosis && state.partsDecision && state.appliance && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-4">
               <div>
                 <h2 className="text-2xl font-bold text-slate-900">Ready for Dispatch</h2>
                 <p className="text-slate-600">Review the job card before booking a technician.</p>
               </div>
            </div>
            
            <TechnicianJobCard 
              appliance={state.appliance}
              complaint={state.complaint}
              diagnosis={state.diagnosis}
              partsDecision={state.partsDecision}
            />
            
            <div className="flex justify-center mt-8 pb-8 space-x-4">
               <Button variant="outline" onClick={reset} className="px-6 py-3">
                 Cancel
               </Button>
               <Button onClick={() => setState(s => ({ ...s, repairStatus: 'booking' }))} className="px-8 py-3 text-lg">
                 Book Technician <ArrowRight className="w-5 h-5 ml-2" />
               </Button>
            </div>
          </div>
        )}

        {/* Stage 5: Booking Form */}
        {currentStage === 5 && state.appliance && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TechnicianBooking 
              appliance={state.appliance} 
              onBook={handleBookTechnician} 
            />
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => setState(s => ({ ...s, repairStatus: null }))} className="border-none hover:bg-slate-100">
                Back to Job Card
              </Button>
            </div>
          </div>
        )}

        {/* Stage 6: Confirmation */}
        {currentStage === 6 && state.bookingDetails && state.diagnosis && state.partsDecision && state.appliance && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BookingConfirmation 
              booking={state.bookingDetails}
              diagnosis={state.diagnosis}
              partsDecision={state.partsDecision}
              appliance={state.appliance}
              complaint={state.complaint}
              onNewDiagnosis={reset}
            />
          </div>
        )}

      </main>
    </div>
  );
}