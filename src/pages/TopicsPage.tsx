// src/pages/TopicsPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contentApi from '../api/content';
import { TopicResponse, TopicDetail } from '../types/content';

const TopicsPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<TopicDetail[]>([]);
  const [subject, setSubject] = useState<TopicResponse['subject'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopicData = async () => {
      if (!subjectId) return;

      try {
        setLoading(true);
        const response = await contentApi.getTopics(parseInt(subjectId));
        setTopics(response.topics);
        setSubject(response.subject);
      } catch (error) {
        console.error('Error fetching topic data:', error);
        setError('Failed to fetch topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTopicData();
  }, [subjectId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/content')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Subjects
        </button>
        <h1 className="text-3xl font-bold">
          {subject?.name || 'Topics'}
        </h1>
        {subject?.description && (
          <p className="text-gray-600 mt-2">{subject.description}</p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(`/chat/${topic.id}`)}
            >
              <div className="relative aspect-video">
                {topic.imageUrl && (
                  <img
                    src={topic.imageUrl}
                    alt={topic.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {topic.name}
                </h3>
                {topic.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {topic.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && topics.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-600">
            No topics available for this subject yet
          </h3>
          <p className="text-gray-500 mt-2">
            Please check back later for updated content
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicsPage;