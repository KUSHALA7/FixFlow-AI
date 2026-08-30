import { useState, useEffect } from 'react';
import { Button, Card, Badge } from '../ui';
import { LogOut, CheckCircle2, MapPin, Calendar, Wrench, User } from 'lucide-react';
import { getSession, getBookings, type Booking, updateBooking } from '../../lib/store';

export function TechnicianDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pending' | 'active' | 'completed'>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const session = getSession();

  const loadBookings = () => {
    if (session) {
      const allBookings = getBookings();
      setBookings(allBookings.filter(b => b.technicianId === session.id).reverse());
    }
  };

  useEffect(() => {
    loadBookings();
    // Poll for updates in MVP
    const interval = setInterval(loadBookings, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    updateBooking(bookingId, { 
      status: newStatus,
      ...(newStatus === 'COMPLETED' ? { completedAt: new Date().toISOString() } : {})
    });
    loadBookings();
  };

  if (!session || session.role !== 'technician') {
    return null;
  }

  const pendingBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const activeBookings = bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  
  const todayBookings = bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0];
    return b.appointmentDate === today && b.status !== 'COMPLETED' && b.status !== 'CANCELLED';
  });

  const renderDashboard = () => (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome, {session.name.split(' ')[0]} 👋</h2>
          <p className="text-slate-600">Here's your work overview for today.</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 cursor-pointer hover:border-blue-300" onClick={() => setActiveTab('pending')}>
              <p className="text-sm text-slate-500 mb-1">New Requests</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-slate-900">{pendingBookings.length}</p>
                <Badge variant="warning">{pendingBookings.length}</Badge>
              </div>
          </Card>
           <Card className="p-4 cursor-pointer hover:border-blue-300" onClick={() => setActiveTab('active')}>
              <p className="text-sm text-slate-500 mb-1">Active Jobs</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-slate-900">{activeBookings.length}</p>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
          </Card>
           <Card className="p-4">
              <p className="text-sm text-slate-500 mb-1">Today's Schedule</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-slate-900">{todayBookings.length}</p>
                 <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
          </Card>
           <Card className="p-4 cursor-pointer hover:border-blue-300" onClick={() => setActiveTab('completed')}>
              <p className="text-sm text-slate-500 mb-1">Completed</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-slate-900">{completedBookings.length}</p>
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
          </Card>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-4">Today's Schedule</h3>
      {renderBookingsList(todayBookings)}
    </>
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <Badge variant="warning">New Request</Badge>;
      case 'ACCEPTED': return <Badge variant="info">Accepted</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">In Progress</Badge>;
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const renderBookingsList = (list: Booking[]) => {
    if (list.length === 0) {
      return (
        <Card className="p-8 text-center border-dashed">
          <p className="text-slate-500">No jobs found.</p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {list.map(booking => (
          <Card key={booking.bookingId} className="p-0 overflow-hidden">
             {/* Header */}
             <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm font-semibold text-slate-700">{booking.bookingId}</span>
                  {getStatusBadge(booking.status)}
                </div>
                <div className="text-sm font-medium text-slate-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {booking.appointmentDate} at {booking.appointmentTime}
                </div>
             </div>

             {/* Content */}
             <div className="p-6">
               <div className="flex flex-col lg:flex-row gap-6">
                 {/* Left Column: Customer & Issue */}
                 <div className="flex-1 space-y-6">
                   <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-1">{booking.appliance} Repair</h3>
                     <p className="text-slate-600 text-sm">{booking.complaint}</p>
                   </div>
                   
                   <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1 flex items-center"><User className="w-3 h-3 mr-1" /> Customer</p>
                        <p className="font-medium text-slate-900 text-sm">{booking.customerName}</p>
                        <p className="text-slate-600 text-sm">{booking.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1 flex items-center"><MapPin className="w-3 h-3 mr-1" /> Address</p>
                        <p className="text-slate-900 text-sm leading-tight">{booking.customerAddress}</p>
                      </div>
                   </div>
                 </div>

                 {/* Right Column: AI Diagnosis & Actions */}
                 <div className="w-full lg:w-72 space-y-4">
                   <div className="border border-blue-100 bg-blue-50/50 rounded-lg p-4">
                     <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">AI Diagnosis</p>
                     <p className="font-medium text-slate-900 text-sm mb-1">{booking.aiDiagnosis}</p>
                     <p className="text-xs text-slate-600 mb-3">Confidence: {booking.confidence}%</p>
                     
                     <div className="flex justify-between items-center pt-3 border-t border-blue-100">
                       <p className="text-xs text-slate-500">Est. Cost</p>
                       <p className="font-bold text-slate-900 text-sm">{booking.estimatedCost}</p>
                     </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="pt-2">
                     {booking.status === 'CONFIRMED' && (
                       <Button onClick={() => handleStatusChange(booking.bookingId, 'ACCEPTED')} className="w-full py-2 bg-blue-600 hover:bg-blue-700">
                         Accept Job
                       </Button>
                     )}
                     {booking.status === 'ACCEPTED' && (
                       <Button onClick={() => handleStatusChange(booking.bookingId, 'IN_PROGRESS')} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white">
                         Start Repair
                       </Button>
                     )}
                     {booking.status === 'IN_PROGRESS' && (
                       <Button onClick={() => handleStatusChange(booking.bookingId, 'COMPLETED')} className="w-full py-2 bg-green-600 hover:bg-green-700">
                         Mark Completed
                       </Button>
                     )}
                     {booking.status === 'COMPLETED' && (
                       <div className="text-center p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm font-medium flex items-center justify-center">
                         <CheckCircle2 className="w-4 h-4 mr-2" /> Job Completed
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 md:h-screen sticky top-0 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tight text-white">FixFlow</h1>
            <p className="text-xs text-slate-400 mt-0.5">Technician Portal</p>
          </div>
        </div>
        
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto flex md:flex-col gap-2 md:gap-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'pending' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            New Requests
            {pendingBookings.length > 0 && <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{pendingBookings.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'active' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            Active Jobs
            {activeBookings.length > 0 && <span className="bg-slate-700 text-white text-xs px-2 py-0.5 rounded-full">{activeBookings.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'completed' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            Completed Jobs
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 shrink-0 border border-slate-700">
               <User className="w-4 h-4 text-slate-400" />
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-medium text-white truncate">{session.name}</p>
               <p className="text-xs text-slate-400 truncate">⭐ {session.rating} Rating</p>
             </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="w-full text-sm border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>
      
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {activeTab === 'dashboard' && renderDashboard()}
        
        {activeTab === 'pending' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-900">New Requests</h2>
             {renderBookingsList(pendingBookings)}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-900">Active Jobs</h2>
             {renderBookingsList(activeBookings)}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-900">Completed Jobs</h2>
             {renderBookingsList(completedBookings)}
          </div>
        )}
      </main>
    </div>
  );
}
