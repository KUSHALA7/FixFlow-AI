import { Button, Card } from '../ui';
import { LogOut, PenTool, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export function CustomerDashboard({ onLogout, onBookRepair }: { onLogout: () => void, onBookRepair: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none tracking-tight">FixFlow</h1>
              <p className="text-xs text-slate-500 mt-0.5">Customer Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="text-sm py-1.5">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back, Customer!</h2>
            <p className="text-slate-600">Manage your appliance repairs here.</p>
          </div>
          <Button onClick={onBookRepair}>Book a Repair</Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
                <div className="flex items-center mb-4 text-blue-600">
                    <Calendar className="w-6 h-6 mr-2" />
                    <h3 className="text-lg font-semibold text-slate-900">My Bookings</h3>
                </div>
                <p className="text-sm text-slate-600">You have no upcoming bookings.</p>
            </Card>

             <Card className="p-6">
                <div className="flex items-center mb-4 text-amber-600">
                    <Clock className="w-6 h-6 mr-2" />
                    <h3 className="text-lg font-semibold text-slate-900">Track Repair</h3>
                </div>
                <p className="text-sm text-slate-600">No repairs currently in progress.</p>
            </Card>

             <Card className="p-6">
                <div className="flex items-center mb-4 text-green-600">
                    <CheckCircle2 className="w-6 h-6 mr-2" />
                    <h3 className="text-lg font-semibold text-slate-900">Completed Repairs</h3>
                </div>
                <p className="text-sm text-slate-600">No completed repairs yet.</p>
            </Card>
        </div>
      </main>
    </div>
  );
}
