import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  BookOpen,
  Trophy,
  Target,
  BarChart2,
  AlertCircle,
} from 'lucide-react';
import contentApi from '../api/content';
import AssessmentStartDialog from "../components/assessment/AssessmentStartDialog.tsx";

interface TopicPerformance {
  topic_id: number;
  topic_name: string;
  subject_name: string;
  total_attempts: number;
  best_score: number;
  average_score: number;
  last_attempt_date: string;
  recent_assessments: {
    id: number;
    score: number;
    date: string;
  }[];
}

interface ProfileData {
  overall_stats: {
    total_assessments: number;
    average_score: number;
  };
  topic_performance: TopicPerformance[];
  unattempted_topics: {
    id: number;
    name: string;
    subject__name: string;
  }[];
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setShowConfirmation(true);
  };

  const handleConfirmAssessment = () => {
    setShowConfirmation(false);
    if (selectedTopic) {
      navigate(`/assessment/${selectedTopic}`);
    }
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await contentApi.getUserProfile();
        setProfileData(response);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
        <p className="text-gray-600">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Info Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={`${user?.firstName}'s profile`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-blue-500">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-600">{user?.grade}</p>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Assessments</h3>
              <p className="text-2xl font-bold text-blue-600">
                {profileData.overall_stats.total_assessments}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Average Score</h3>
              <p className="text-2xl font-bold text-green-600">
                {profileData.overall_stats.average_score.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Topics Covered</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {profileData.topic_performance.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Performance */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Topic Performance</h2>
        <div className="space-y-6">
          {profileData.topic_performance.map((topic) => (
            <motion.div
              key={topic.topic_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b last:border-b-0 pb-6 last:pb-0"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold mb-1">{topic.topic_name}</h3>
                  <p className="text-sm text-gray-600">{topic.subject_name}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {topic.best_score.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Best Score</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Attempts</div>
                  <div className="font-semibold">{topic.total_attempts}</div>
                </div>
                <div>
                  <div className="text-gray-600">Average Score</div>
                  <div className="font-semibold">
                    {topic.average_score.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Last Attempt</div>
                  <div className="font-semibold">
                    {new Date(topic.last_attempt_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {topic.recent_assessments.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Recent Scores</div>
                  <div className="flex space-x-2">
                    {topic.recent_assessments.map((assessment, index) => (
                      <div
                        key={assessment.id}
                        className="h-20 w-4 bg-gray-100 rounded relative cursor-pointer group"
                        onClick={() => navigate(`/assessment-review/${assessment.id}`)}
                      >
                        <div
                          className="absolute bottom-0 w-full rounded bg-blue-500 transition-all"
                          style={{ height: `${assessment.score}%` }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {assessment.score.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Unattempted Topics */}
      {profileData.unattempted_topics.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Topics to Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileData.unattempted_topics.map((topic) => (
              <motion.div
                key={topic.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleTopicClick(topic)}
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-semibold">{topic.name}</h3>
                    <p className="text-sm text-gray-600">{topic.subject__name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <AssessmentStartDialog
              isOpen={showConfirmation}
              onClose={() => setShowConfirmation(false)}
              onConfirm={handleConfirmAssessment}
              topicName={selectedTopic?.name}
              subjectName={selectedTopic?.subject_name}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;