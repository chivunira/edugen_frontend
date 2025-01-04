import { CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';

const QuestionStatusIndicator = ({ score }) => {
  // Thresholds for different status levels
  const PERFECT_SCORE = 100;
  const HIGH_SCORE_THRESHOLD = 80;
  const MEDIUM_SCORE_THRESHOLD = 50;
  const LOW_SCORE_THRESHOLD = 1;

  if (score >= PERFECT_SCORE) {
    return (
      <div className="flex items-center text-green-600" title="Perfect Score">
        <CheckCircle className="w-6 h-6" />
      </div>
    );
  } else if (score >= HIGH_SCORE_THRESHOLD) {
    return (
      <div className="flex items-center text-emerald-500" title="Excellent">
        <CheckCircle className="w-6 h-6" strokeWidth={1.5} />
      </div>
    );
  } else if (score >= MEDIUM_SCORE_THRESHOLD) {
    return (
      <div className="flex items-center text-amber-500" title="Partially Correct">
        <AlertCircle className="w-6 h-6" />
      </div>
    );
  } else if (score >= LOW_SCORE_THRESHOLD) {
    return (
      <div className="flex items-center text-orange-500" title="Needs Improvement">
        <HelpCircle className="w-6 h-6" />
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-red-500" title="Incorrect">
        <XCircle className="w-6 h-6" />
      </div>
    );
  }
};

export default QuestionStatusIndicator;