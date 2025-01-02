// src/pages/ContentPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import contentApi from '../api/content';
import { Subject } from '../types/content';

const ContentPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await contentApi.getSubjects();
        // Convert HTTP URLs to HTTPS if needed
        const processedData: Subject[] = data.map(subject => ({
        id: subject.id,
        name: subject.name,
        description: subject.description,
        imageUrl: subject.imageUrl ? subject.imageUrl.replace('http://', 'https://') : null,
        topicCount: subject.topicCount
        }));
        console.log('Fetched processed subjects:', processedData);
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

  if (error) {
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-600 text-center">{error}</div>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Subjects on Offer</h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => navigate(`/dashboard/content/${subject.id}/topics`)}
            >
              <div className="p-6">
                <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                  {subject.imageUrl ? (
                      <img
                          src={subject.imageUrl}
                          alt={subject.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                  ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
                {subject.description && (
                    <p className="text-gray-600">{subject.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentPage;