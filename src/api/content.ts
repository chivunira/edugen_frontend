// src/api/content.ts
import apiClient from './client';
import { Subject, TopicResponse, ChatMessage } from '../types/content';

interface ChatResponse {
  prompt: string;
  response: string;
}

// Type for API responses
interface APIResponse<T> {
  data: T;
  status: number;
}

const contentApi = {
  /**
   * Fetches all available subjects
   * @returns Promise containing array of subjects
   */
  getSubjects: async (): Promise<Subject[]> => {
    try {
      const response = await apiClient.get('/tutor/subjects/');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  },

  /**
   * Fetches topics for a specific subject
   * @param subjectId - The ID of the subject
   * @returns Promise containing array of topics
   */
  getTopics: async (subjectId: number): Promise<TopicResponse> => {
    try {
      const response = await apiClient.get<TopicResponse>(`/tutor/topics/${subjectId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  },

  /**
   * Fetches details for a specific topic
   * @param topicId - The ID of the topic
   * @returns Promise containing the topic details
   */
  getTopicDetails: async (topicId: number): Promise<TopicDetail> => {
    try {
      const response = await apiClient.get(`/tutor/topics/detail/${topicId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching topic details:', error);
      throw error;
    }
  },

  /**
   * Fetches chat history for a specific topic
   * @param topicId - The ID of the topic
   * @returns Promise containing array of chat messages
   */
  getChatHistory: async (topicId: number): Promise<ChatMessage[]> => {
    try {
      const response: APIResponse<ChatMessage[]> = await apiClient.get(`/tutor/chat/${topicId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  /**
   * Sends a new message in the chat for a specific topic
   * @param topicId - The ID of the topic
   * @param prompt - The user's message
   * @returns Promise containing the chat response
   */
  sendMessage: async (topicId: number, prompt: string, isInitialOverview = false): Promise<ChatResponse> => {
    try {
      const response: APIResponse<ChatResponse> = await apiClient.post(`/tutor/chat/${topicId}/post/`, {
        prompt,
        isInitialOverview
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};

export default contentApi;