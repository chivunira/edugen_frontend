// src/pages/WelcomePage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion} from 'framer-motion';
import { RootState } from '../store/store';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Protect route - redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }else if (!user?.grade){
      navigate('/register-class');
    }
  }, [isAuthenticated, user, navigate]);

  const handleStartLearning = () => {
    navigate('/dashboard/content');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-white relative">
      <Logo />

      <div className="w-full h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full space-y-8 text-center"
        >
          {/* User Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center"
          >
            {user.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={`${user.firstName}'s avatar`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-primary">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </span>
            )}
          </motion.div>

          {/* Welcome Message */}
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold font-comic"
            >
              Welcome to EDUGEN, {user.firstName}!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 font-comic"
            >
              You're all set to start your learning journey in {user.grade}.<br />
              Ready to explore and learn with our AI-powered education platform?
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-6"
            >
              <Button
                onClick={handleStartLearning}
                className="px-8 py-3"
              >
                <span className="flex items-center space-x-2">
                  <span>Start Learning</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Button>
            </motion.div>
          </div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 bg-blue-50 p-6 rounded-lg text-left"
          >
            <h3 className="font-bold text-primary mb-3">Quick Tips:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Start with the Science topics that interest you most</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Use the AI chatbot to ask questions and deepen your understanding</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Take assessments to track your progress</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;