import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, ArrowLeft, Star } from 'lucide-react';
import contentApi from '../api/content';
import { TopicResponse, TopicDetail } from '../types/content';
import { AssessmentSummary } from '../types/assessment';
import _ from 'lodash';


const AssessmentTopicsPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<TopicDetail[]>([]);
  const [subject, setSubject] = useState<TopicResponse['subject'] | null>(null);
  const [topicSummaries, setTopicSummaries] = useState<Record<number, AssessmentSummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedFetchTopicData = useCallback(
    _.debounce(async () => {
      if (!subjectId) return;

    try {
      setLoading(true);
      const response = await contentApi.getTopics(parseInt(subjectId));
      setTopics(response.topics);
      setSubject(response.subject);

      const summaryPromises = response.topics.map(topic =>
        contentApi.getAssessmentSummary(topic.id)
      );

      const summaries = await Promise.all(summaryPromises);
      const summaryMap: Record<number, AssessmentSummary> = {};

      summaries.forEach((summary, index) => {
        summaryMap[response.topics[index].id] = summary;
      });

      setTopicSummaries(summaryMap);
    } catch (error) {
      console.error('Error fetching topic data:', error);
      setError('Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  }, 300),
  [subjectId]
);

  useEffect(() => {
    debouncedFetchTopicData();
    return () => debouncedFetchTopicData.cancel();
  }, [debouncedFetchTopicData]);

  // Calculate overall progress
  const completedTopics = Object.values(topicSummaries).filter(summary =>
    summary && summary.total_attempts > 0
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/assessments')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Subjects
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{subject?.name || 'Topics'}</h1>
            <p className="text-gray-600">Select a topic to start your assessment</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-blue-500" />
              <span className="text-blue-700 font-semibold">Your Progress</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {completedTopics}/{topics.length} Topics Completed
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {topics.map((topic, index) => {
            const summary = topicSummaries[topic.id];
            const hasAttempted = summary && summary.total_attempts > 0;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-md transition-all duration-300 group 
                  ${hasAttempted ? 'border-2 border-green-200' : 'hover:shadow-lg cursor-pointer'}`}
                onClick={() => navigate(`/assessment/${topic.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-blue-100 p-3">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {topic.name}
                      </h3>
                      {topic.description && (
                        <p className="text-gray-600 mb-4">{topic.description}</p>
                      )}

                      {hasAttempted ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Trophy className="w-5 h-5 text-green-500" />
                            <span className="text-green-600 font-medium">
                              Assessment Completed
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= summary.best_score/20
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-600">
                              Best Score: {summary.best_score}%
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Completed {summary.total_attempts} attempt{summary.total_attempts !== 1 ? 's' : ''}
                          </div>
                          <div className="text-sm text-blue-500">
                            Latest Score: {summary.last_score}%
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-blue-500 group-hover:translate-x-1 transition-transform">
                            Start Assessment →
                          </span>
                          <span className="text-sm text-gray-500">
                            ~20 mins
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssessmentTopicsPage;