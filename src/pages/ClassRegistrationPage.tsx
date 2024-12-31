// src/pages/ClassRegistrationPage.tsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { updateGrade, resetGradeStatus } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store/store';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';

const grades = [
  {
    level: 'Grade 6',
    description: 'Starting your journey in middle school science'
  },
  {
    level: 'Grade 7',
    description: 'Advancing your scientific knowledge'
  },
  {
    level: 'Grade 8',
    description: 'Diving deeper into complex concepts'
  },
  {
    level: 'Grade 9',
    description: 'Preparing for high school science'
  }
];

const ClassRegistrationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const { gradeUpdateStatus, error } = useSelector((state: RootState) => state.auth);

  // Reset grade status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetGradeStatus());
    };
  }, [dispatch]);

  // Navigate to welcome page on successful grade update
  useEffect(() => {
    if (gradeUpdateStatus === 'success') {
      const timer = setTimeout(() => {
        navigate('/welcome');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gradeUpdateStatus, navigate]);

  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
  };

  const handleConfirm = async () => {
    if (!selectedGrade) return;

    try {
      await dispatch(updateGrade(selectedGrade)).unwrap();
      // Only navigate after successful grade update
      navigate('/welcome');
    } catch (error: any) {
      if (error.message === 'No access token found' || error?.response?.status === 401) {
        navigate('/signin');
      } else {
        console.error('Failed to update grade:', error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      <Logo />

      <div className="w-full h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full space-y-8"
        >
          {/* Title */}
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold font-comic"
            >
              Class Registration
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-gray-600 font-comic"
            >
              What class would you want to enroll in?
            </motion.p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Grade Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grades.map((grade, index) => (
                <motion.button
                    key={grade.level}
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: index * 0.1}}
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    onClick={() => handleGradeSelect(grade.level)}
                    disabled={gradeUpdateStatus === 'pending'}
                    className={`
        p-6 rounded-lg font-comic text-left transition-colors relative
        ${selectedGrade === grade.level
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-blue-100 text-primary hover:bg-blue-200'
                    }
      `}
                >
                  <h3 className="text-lg font-bold mb-2">{grade.level}</h3>
                  <p className="text-sm opacity-90">{grade.description}</p>
                  {selectedGrade === grade.level && (
                      <motion.div
                          initial={{scale: 0}}
                          animate={{scale: 1}}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                  )}
                </motion.button>
            ))}
          </div>

          {/* Confirmation Button */}
          <AnimatePresence>
            {selectedGrade && (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 20}}
                    className="flex justify-center"
                >
                  <Button
                      onClick={handleConfirm}
                      disabled={!selectedGrade || gradeUpdateStatus === 'pending'}
                      className="w-full sm:w-auto"
                  >
                    {gradeUpdateStatus === 'pending' ? (
                        <div className="flex items-center space-x-2">
                          <span>Confirming...</span>
                          <motion.div
                              animate={{rotate: 360}}
                              transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                        </div>
                    ) : (
                        'Confirm Selection'
                    )}
                  </Button>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {gradeUpdateStatus === 'success' && (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20 }}
                className="text-center text-green-600 font-comic"
              >
                Grade updated successfully! Redirecting...
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassRegistrationPage;