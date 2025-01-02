import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserAvatar from '../../components/common/UserAvatar';
import FormattedMessage from './FormattedMessage';
import { User } from '../../types/auth';
import { ChatMessage } from '../../types/content';

interface ChatInterfaceProps {
  user: User | null;
  topicName: string;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => Promise<any>;
  isTyping: boolean;
}

interface DisplayMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    user,
    topicName,
    chatHistory,
    onSendMessage,
    isTyping,
}) => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const displayMessages = chatHistory.flatMap((chat): DisplayMessage[] => [
      {
        id: chat.id * 2 - 1,
        text: chat.prompt,
        sender: 'user',
        timestamp: chat.timestamp,
      },
      {
        id: chat.id * 2,
        text: chat.response,
        sender: 'bot',
        timestamp: chat.timestamp,
      }
    ]);

    setMessages(displayMessages);
  }, [chatHistory, topicName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      await onSendMessage(messageText);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Topic Header */}
      <div className="bg-white shadow-sm p-4 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold">Topic: {topicName}</h1>
          <p className="text-sm text-gray-500">Ask questions about this topic</p>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-blue-50/30">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {message.sender === 'bot' ? (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 mr-2 overflow-hidden">
                    <img src="/src/assets/images/landing.png" alt="Bot" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="ml-2">
                    <UserAvatar
                      firstName={user?.firstName}
                      lastName={user?.lastName}
                      profilePhoto={user?.profile_photo}
                      size="sm"
                    />
                  </div>
                )}
                <div
                  className={`rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white shadow-sm'
                  }`}
                >
                  <FormattedMessage text={message.text} />
                  <span className="text-xs opacity-70 mt-2 block">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 overflow-hidden">
                <img src="/src/assets/images/landing.png" alt="Bot" className="w-full h-full object-cover" />
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                </div>
                <span className="text-sm text-gray-500">
                  Typing...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Area */}
      <div className="bg-white border-t">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto p-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;