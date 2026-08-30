import { useState, useEffect } from 'react';
import { Button, Card, Badge } from '../ui';
import { LogOut, PenTool, Calendar, Clock, CheckCircle2, User, Wrench } from 'lucide-react';
import { getSession, getBookings, type Booking, updateBooking } from '../../lib/store';
import { CustomerRating } from '../booking/CustomerRating';

export function CustomerDashboard({ onLogout, onBookRepair }: { onLogout: () => void, onBookRepair: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'track' | 'completed'>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
  const session = getSession();

  const loadBookings = () => {
    if (session) {
      const allBookings = getBookings();
      setBookings(allBookings.filter(b => b.customerId === session.id).reverse());
    }
  };

  useEffect(() => {
    loadBookings();
    // Poll for updates in MVP
    const interval = setInterval(loadBookings, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRatingSubmit = (rating: number, feedback: string) => {
    if (ratingBooking) {
      updateBooking(ratingBooking.bookingId, { rating, feedback });
      setRatingBooking(null);
      loadBookings();
    }
  };

  if (!session || session.role !== 'customer') {
    return null;
  }

  if (ratingBooking) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <CustomerRating 
          technicianName={ratingBooking.technicianName} 
          appliance={ratingBooking.appliance}
          onSubmit={handleRatingSubmit}
          onSkip={() => setRatingBooking(null)}
        />
      </div>
    );
  }

  const activeBookings = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  const renderDashboard = () => (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, {session.name.split(' ')[0]} 👋</h2>
          <p className="text-slate-600">Manage your appliance repairs here.</p>
        </div>
        <Button onClick={onBookRepair}>Book a Repair</Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setActiveTab('bookings')}>
              <div className="flex items-center mb-4 text-blue-600">
                  <Calendar className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold text-slate-900">My Bookings</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{activeBookings.length}</p>
              <p className="text-sm text-slate-600 mt-1">Active bookings</p>
          </Card>

           <Card className="p-6 cursor-pointer hover:border-amber-300 transition-colors" onClick={() => setActiveTab('track')}>
              <div className="flex items-center mb-4 text-amber-600">
                  <Clock className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold text-slate-900">Track Repair</h3>
              </div>
              <p className="text-sm text-slate-600">View real-time status of your ongoing repairs.</p>
          </Card>

           <Card className="p-6 cursor-pointer hover:border-green-300 transition-colors" onClick={() => setActiveTab('completed')}>
              <div className="flex items-center mb-4 text-green-600">
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold text-slate-900">Completed Repairs</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{completedBookings.length}</p>
              <p className="text-sm text-slate-600 mt-1">Past repairs</p>
          </Card>
      </div>
    </>
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <Badge variant="warning">Confirmed</Badge>;
      case 'ACCEPTED': return <Badge variant="info">Accepted by Tech</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">In Progress</Badge>;
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const renderBookingsList = (list: Booking[], showTrack: boolean = false) => {
    if (list.length === 0) {
      return (
        <Card className="p-8 text-center">
          <p className="text-slate-500 mb-4">No bookings found in this category.</p>
          {activeTab === 'bookings' && <Button onClick={onBookRepair}>Book a Repair Now</Button>}
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {list.map(booking => (
          <Card key={booking.bookingId} className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-500">{booking.bookingId}</span>
                  {getStatusBadge(booking.status)}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900">{booking.appliance} Repair</h3>
                <p className="text-sm text-slate-600">{booking.complaint}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <span className="text-xs text-slate-500 block">Technician</span>
                    <span className="font-medium text-slate-900">{booking.technicianName}</span>
                    <span className="text-xs text-slate-500 block mt-1">{booking.technicianPhone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Appointment</span>
                    <span className="font-medium text-slate-900">{booking.appointmentDate}</span>
                    <span className="text-xs text-slate-500 block mt-1">{booking.appointmentTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[140px]">
                {showTrack && (
                  <Button onClick={() => setActiveTab('track')} className="w-full">
                    Track Status
                  </Button>
                )}
                {booking.status === 'COMPLETED' && !booking.rating && (
                  <Button onClick={() => setRatingBooking(booking)} variant="outline" className="w-full border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
                    Rate Technician
                  </Button>
                )}
                {booking.status === 'COMPLETED' && booking.rating && (
                  <div className="text-center p-2 bg-green-50 rounded border border-green-100">
                    <div className="text-yellow-400">{'★'.repeat(booking.rating)}{'☆'.repeat(5 - booking.rating)}</div>
                    <span className="text-xs text-green-700">Feedback submitted</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderTrack = () => {
    if (activeBookings.length === 0) {
      return (
        <Card className="p-8 text-center">
          <p className="text-slate-500">No active repairs to track.</p>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {activeBookings.map(booking => {
          const steps = ['CONFIRMED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];
          const currentIndex = steps.indexOf(booking.status);

          return (
            <Card key={booking.bookingId} className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{booking.bookingId} - {booking.appliance}</h3>
                <p className="text-sm text-slate-600">Technician: {booking.technicianName}</p>
              </div>

              <div className="relative">
                {/* Visual Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200"></div>
                <div 
                  className="absolute left-[15px] top-4 w-0.5 bg-blue-600 transition-all duration-500"
                  style={{ height: `${(currentIndex / 3) * 100}%` }}
                ></div>

                <div className="space-y-6 relative">
                  <div className={`flex gap-4 ${currentIndex >= 0 ? 'text-blue-700' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${currentIndex >= 0 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold">Booking Confirmed</p>
                      <p className="text-sm opacity-80">Your repair request has been received.</p>
                    </div>
                  </div>

                  <div className={`flex gap-4 ${currentIndex >= 1 ? 'text-blue-700' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${currentIndex >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                      {currentIndex >= 1 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full bg-current" />}
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold">Technician Accepted</p>
                      <p className="text-sm opacity-80">{booking.technicianName} has accepted your job.</p>
                    </div>
                  </div>

                  <div className={`flex gap-4 ${currentIndex >= 2 ? 'text-amber-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${currentIndex >= 2 ? 'bg-amber-500 text-white' : 'bg-slate-200'}`}>
                      {currentIndex >= 2 ? <Wrench className="w-4 h-4" /> : <div className="w-3 h-3 rounded-full bg-current" />}
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold">Repair In Progress</p>
                      <p className="text-sm opacity-80">Technician is working on your appliance.</p>
                    </div>
                  </div>

                  <div className={`flex gap-4 ${currentIndex >= 3 ? 'text-green-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${currentIndex >= 3 ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
                      {currentIndex >= 3 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full bg-current" />}
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold">Repair Completed</p>
                      <p className="text-sm opacity-80">The job is done.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 md:h-screen sticky top-0 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tight">FixFlow</h1>
            <p className="text-xs text-slate-500 mt-0.5">Customer Portal</p>
          </div>
        </div>
        
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto flex md:flex-col gap-2 md:gap-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={onBookRepair}
            className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Book Repair
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            My Bookings
            {activeBookings.length > 0 && <Badge variant={activeTab === 'bookings' ? 'default' : 'info'} className="ml-2 text-xs">{activeBookings.length}</Badge>}
          </button>
          <button 
            onClick={() => setActiveTab('track')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'track' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            Track Repair
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'completed' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            Completed Repairs
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3 shrink-0">
               <User className="w-4 h-4 text-slate-600" />
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-medium text-slate-900 truncate">{session.name}</p>
               <p className="text-xs text-slate-500 truncate">{session.phone}</p>
             </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="w-full text-sm">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>
      
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {activeTab === 'dashboard' && renderDashboard()}
        
        {activeTab === 'bookings' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-900">My Active Bookings</h2>
             {renderBookingsList(activeBookings, true)}
          </div>
        )}

        {activeTab === 'track' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-900">Track Repairs</h2>
             {renderTrack()}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-900">Completed Repairs</h2>
             {renderBookingsList(completedBookings)}
          </div>
        )}
      </main>
    </div>
  );
}
