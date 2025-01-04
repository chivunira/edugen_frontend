import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Clock } from 'lucide-react';
import { Subject } from '../types/content';
import contentApi from '../api/content';

const AssessmentsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await contentApi.getSubjects();
        const processedData = data.map(subject => ({
          ...subject,
          imageUrl: subject.imageUrl ? subject.imageUrl.replace('http://', 'https://') : null,
        }));
        setSubjects(processedData);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        setError('Failed to fetch subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Assessments</h1>
        <p className="text-gray-600">Test your knowledge and track your progress in different subjects</p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:text-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => navigate(`/dashboard/assessments/${subject.id}/topics`)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{subject.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        <span>10 Assessments</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>15-20 mins each</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-md text-sm">
                        Latest Score: 85%
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-sm">
                        {subject.topicCount} Topics
                      </span>
                    </div>
                    <span className="text-blue-500 group-hover:translate-x-1 transition-transform">
                      Start Assessment →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentsPage;