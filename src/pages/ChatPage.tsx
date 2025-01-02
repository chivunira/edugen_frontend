// ChatPage.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ChatInterface from "../components/chat/ChatInterface";
import contentApi from '../api/content';
import { TopicDetail, ChatMessage } from '../types/content';

const ChatPage = () => {
  const { topicId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const initializationRef = useRef(false);

  useEffect(() => {
    const initializeChat = async () => {
      if (!topicId || initializationRef.current) return;

      initializationRef.current = true;

      try {
        setLoading(true);
        const [topicDetails, history] = await Promise.all([
          contentApi.getTopicDetails(parseInt(topicId)),
          contentApi.getChatHistory(parseInt(topicId))
        ]);

        setTopic(topicDetails);

        if (history.length === 0) {
          console.log('No chat history found, requesting overview');
          setIsTyping(true);
          try {
            const overviewResponse = await contentApi.sendMessage(
              parseInt(topicId),
              "",
              true // isInitialOverview flag
            );

            if (overviewResponse) {
              setChatHistory([{
                id: Date.now(),
                prompt: overviewResponse.prompt,
                response: overviewResponse.response,
                timestamp: new Date().toISOString()
              }]);
            }
          } catch (overviewError) {
            console.error('Error getting topic overview:', overviewError);
          } finally {
            setIsTyping(false);
          }
        } else {
          setChatHistory(history);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        setError('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    // Reset initialization when topicId changes
    return () => {
      initializationRef.current = false;
    };
  }, [topicId]); // Remove isInitialized from dependencies

  const handleSendMessage = async (message: string) => {
    if (!topicId) return;

    setIsTyping(true);
    try {
      const response = await contentApi.sendMessage(parseInt(topicId), message);
      setChatHistory(prev => [
        ...prev,
        {
          id: Date.now(),
          prompt: message,
          response: response.response,
          timestamp: new Date().toISOString()
        }
      ]);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-red-600">{error || 'Topic not found'}</div>
      </div>
    );
  }

  return (
    <ChatInterface 
      user={user}
      topicName={topic.name}
      chatHistory={chatHistory}
      onSendMessage={handleSendMessage}
      isTyping={isTyping}
    />
  );
};

export default ChatPage;