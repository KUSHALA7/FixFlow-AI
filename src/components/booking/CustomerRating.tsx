import { useState } from 'react';
import { Card, Button } from '../ui';
import { Star, CheckCircle2, MessageSquare } from 'lucide-react';

interface CustomerRatingProps {
  technicianName: string;
  appliance: string;
  onSubmit: (rating: number, comment: string) => void;
  onSkip: () => void;
}

export function CustomerRating({ technicianName, appliance, onSubmit, onSkip }: CustomerRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
    // Simulate delay for feel
    setTimeout(() => {
      onSubmit(rating, comment);
    }, 1500);
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto mt-20 border-green-200 bg-green-50/30">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
        <p className="text-slate-600 mb-6">
          Your feedback helps us improve and rewards our best technicians.
        </p>
        <Button onClick={onSkip} className="w-full">
          Return Home
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8 max-w-md mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Rate Your Experience</h2>
        <p className="text-slate-600">
          How did {technicianName} do with your {appliance} repair today?
        </p>
      </div>

      <div className="flex justify-center space-x-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 focus:outline-none transition-transform hover:scale-110"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            <Star 
              className={`w-10 h-10 ${
                (hoverRating || rating) >= star 
                  ? 'fill-amber-400 text-amber-400' 
                  : 'text-slate-300'
              } transition-colors`} 
            />
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Add a comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Tell us what you liked about ${technicianName}'s service...`}
            className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
          />
        </div>

        <div className="flex flex-col space-y-3 pt-4 border-t border-slate-100">
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0}
            className="w-full py-3 text-lg"
          >
            Submit Review
          </Button>
          <button 
            onClick={onSkip}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 py-2"
          >
            Skip for now
          </button>
        </div>
      </div>
    </Card>
  );
}