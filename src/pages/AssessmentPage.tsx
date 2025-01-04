import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  startAssessment,
  submitAnswer,
  completeAssessment,
  setCurrentQuestionIndex,
  resetAssessment
} from '../store/slices/assessmentSlice';

const AssessmentPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    currentAssessment,
    currentQuestionIndex,
    answers,
    feedback,
    loading,
    error
  } = useSelector((state: RootState) => state.assessment);

  const [answer, setAnswer] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(1200); // 20 minutes
  const [isAssessmentComplete, setIsAssessmentComplete] = useState<boolean>(false);

  // Initialize assessment
  useEffect(() => {
    if (!topicId) return;

    const initializeAssessment = async () => {
      try {
        await dispatch(startAssessment(parseInt(topicId))).unwrap();
      } catch (error) {
        console.error('Error starting assessment:', error);
      }
    };

    initializeAssessment();
    return () => { dispatch(resetAssessment()); };
  }, [topicId, dispatch]);

  // Timer effect
  useEffect(() => {
    if (!currentAssessment || isAssessmentComplete || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleAssessmentComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentAssessment, isAssessmentComplete, loading]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmitAnswer = async () => {
    if (!currentAssessment || !answer.trim()) return;

    setSubmitting(true);
    try {
      const currentQuestion = currentAssessment.questions[currentQuestionIndex];
      await dispatch(submitAnswer({
        assessmentId: currentAssessment.id,
        questionId: currentQuestion.id,
        answer: answer.trim()
      })).unwrap();
      setShowFeedback(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setAnswer('');
    setShowFeedback(false);
    if (currentQuestionIndex < currentAssessment!.questions.length - 1) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
    } else {
      handleAssessmentComplete();
    }
  };

  const handleAssessmentComplete = async () => {
    if (!currentAssessment) return;

    try {
      await dispatch(completeAssessment(currentAssessment.id)).unwrap();
      setIsAssessmentComplete(true);
    } catch (error) {
      console.error('Error completing assessment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !currentAssessment) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load assessment'}</p>
          <button
            onClick={() => navigate('/dashboard/assessments')}
            className="text-blue-500 hover:text-blue-600"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  if (isAssessmentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
            <h2 className="text-2xl font-bold mt-4 mb-2">Assessment Complete!</h2>
            <p className="text-gray-600 mb-6">
              You've completed the {currentAssessment.topic_name} assessment
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {currentAssessment.total_score?.toFixed(1)}%
              </div>
              <p className="text-gray-600">Your Score</p>
            </div>

            <div className="space-y-4">
              <button
                  onClick={() => navigate(`/assessment-review/${currentAssessment.id}`)}
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Review Answers
              </button>

              <button
                  onClick={() => navigate('/dashboard/assessments')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Assessments
              </button>

              <button
                  onClick={() => navigate(`/chat/${topicId}`)}
                  className="w-full border border-gray-200 text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Study with EDUGEN
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = currentAssessment.questions[currentQuestionIndex];
  const currentFeedback = feedback[currentQuestion.id];

  return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">{currentAssessment.topic_name}</h1>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {currentAssessment.questions.length}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                timeLeft < 300 ? 'text-red-500' : 'text-gray-600'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>

              <div className="h-8 w-px bg-gray-200"></div>

              <motion.div
                className="w-24 h-2 bg-gray-200 rounded-full"
                title="Progress"
              >
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100}%`
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold">
                {currentQuestion.question_text}
              </h2>

              <div className="space-y-4">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={showFeedback}
                  placeholder="Write your answer here..."
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] text-lg"
                />

                {!showFeedback ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={submitting || !answer.trim()}
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {submitting ? 'Checking...' : 'Submit Answer'}
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className={`p-4 rounded-lg flex items-start space-x-3 ${
                      currentFeedback.isCorrect 
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {currentFeedback.isCorrect ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">
                          {currentFeedback.isCorrect
                            ? 'Great work! 🌟'
                            : 'Keep trying! You\'re learning! 💪'}
                        </p>
                        <p className="text-sm mt-1">
                          {currentFeedback.feedback}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors text-lg group flex items-center justify-center"
                    >
                      <span className="mr-2">
                        {currentQuestionIndex < currentAssessment.questions.length - 1
                          ? 'Next Question'
                          : 'Finish Assessment'}
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;