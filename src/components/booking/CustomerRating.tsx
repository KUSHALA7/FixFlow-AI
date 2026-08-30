import { useState } from 'react';
import { Card, Button } from '../ui';
import { Star, CheckCircle2 } from 'lucide-react';

export function CustomerRating({ technicianName, appliance, onSubmit, onSkip }: { technicianName: string, appliance: string, onSubmit: (rating: number, feedback: string) => void, onSkip: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, feedback);
      setSubmitted(true);
      setTimeout(onSkip, 1500); // Auto close after success
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto p-8 text-center border-green-200">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
        <p className="text-slate-600">Your feedback helps us improve our service.</p>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto p-8 border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Repair Completed</h2>
        <p className="text-slate-600">How was your experience with {technicianName} for your {appliance} repair?</p>
      </div>

      <div className="flex justify-center space-x-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="focus:outline-none transition-transform hover:scale-110"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
          >
            <Star 
              className={`w-10 h-10 ${
                star <= (hover || rating) 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-slate-200'
              } transition-colors`} 
            />
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tell us about your experience (optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
            placeholder="Was the technician professional? Was the issue resolved completely?"
          />
        </div>

        <div className="flex flex-col space-y-3 pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0}
            className="w-full py-3"
          >
            Submit Feedback
          </Button>
          <Button 
            variant="ghost" 
            onClick={onSkip}
            className="w-full text-slate-500 hover:text-slate-700"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </Card>
  );
}
