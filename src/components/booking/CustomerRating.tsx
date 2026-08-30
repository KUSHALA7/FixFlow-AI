import { useState } from 'react';
import { Card, Button } from '../ui';
import { Star, CheckCircle2 } from 'lucide-react';

interface CustomerRatingProps {
  technicianName: string;
  appliance: string;
  onSubmit: (rating: number, feedback: string) => void;
  onSkip: () => void;
}

export function CustomerRating({ technicianName, appliance, onSubmit, onSkip }: CustomerRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      setSubmitted(true);
      setTimeout(() => {
        onSubmit(rating, feedback);
      }, 1500);
    }
  };

  if (submitted) {
    return (
      <Card className="p-8 max-w-md mx-auto text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Thank You!</h2>
        <p className="text-slate-600">Your feedback helps us improve our service.</p>
      </Card>
    );
  }

  return (
    <Card className="p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Rate your experience</h2>
        <p className="text-slate-600">How was your {appliance} repair with {technicianName}?</p>
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
                  ? 'fill-amber-400 text-amber-400' 
                  : 'text-slate-200'
              }`} 
            />
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-8">
        <label className="block text-sm font-medium text-slate-700">
          Any additional feedback? (Optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you liked or how we can improve..."
          className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Button 
          onClick={handleSubmit} 
          disabled={rating === 0}
          className="w-full py-3"
        >
          Submit Review
        </Button>
        <Button 
          variant="outline" 
          onClick={onSkip}
          className="w-full py-3 border-none hover:bg-slate-100 text-slate-500"
        >
          Skip for now
        </Button>
      </div>
    </Card>
  );
}