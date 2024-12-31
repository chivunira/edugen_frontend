// src/pages/LandingPage.tsx
import { useNavigate } from 'react-router-dom';
import landingImage from '../assets/images/landing.png'; // Import the landing image

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left side - Text and Buttons */}
        <div className="flex flex-col items-start space-y-6 md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold font-comic">EDUGEN</h1>
          <p className="text-gray-600 text-lg md:text-xl font-comic">
            Your Personal AI Tutor: Learning Made Easy
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors font-comic"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate('/signin')}
              className="px-8 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors font-comic"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative w-full max-w-md">
            <img
              src={landingImage}
              alt="Education illustration with books, graduation caps, and learning symbols"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;