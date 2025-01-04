import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import contentApi from '../api/content';
import { AssessmentResult } from '../types/assessment';

interface ExpandedStates {
  [key: number]: boolean;
}

const AssessmentReviewPage = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<ExpandedStates>({});

  useEffect(() => {
    const fetchAssessmentResults = async () => {
      if (!assessmentId) return;

      try {
        const response = await contentApi.getAssessmentResults(parseInt(assessmentId));
        setResult(response);

        // Initialize all questions as expanded
        const initialExpandedState: ExpandedStates = {};
        response.questionResults.forEach((_, index) => {
          initialExpandedState[index] = true;
        });
        setExpandedQuestions(initialExpandedState);
      } catch (error) {
        console.error('Error fetching assessment results:', error);
        setError('Failed to load assessment results');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentResults();
  }, [assessmentId]);

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error Loading Results</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard/assessments')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/assessments')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Assessments
          </button>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-2">Assessment Review</h1>
            <p className="text-gray-600">Completed on {new Date(result.completedAt).toLocaleDateString()}</p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-blue-600">
                  {result.score.toFixed(1)}%
                </div>
                <div className="text-gray-500">
                  Overall Score
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-4">
          {result.questionResults.map((question, index) => (
            <motion.div
              key={question.questionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {question.isCorrect ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">Question {index + 1}</h3>
                      <div className="text-sm text-gray-500">
                        Score: {question.score.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  {expandedQuestions[index] ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedQuestions[index] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t"
                >
                  <div className="p-6 space-y-4">
                    {/* Question Text */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Question</h4>
                      <div className="text-gray-900 font-medium mb-4">
                        {question.questionText}
                      </div>
                    </div>

                    {/* Your Answer */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Your Answer</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {question.userAnswer}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Feedback</h4>
                      <div className={`rounded-lg p-4 ${
                        question.isCorrect ? 'bg-green-50' : 'bg-yellow-50'
                      }`}>
                        <p className={question.isCorrect ? 'text-green-700' : 'text-yellow-700'}>
                          {question.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate(`/chat/${result.topicId}`)}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Study with AI Tutor
          </button>
          <button
            onClick={() => navigate(`/assessment/${result.topicId}`)}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentReviewPage;