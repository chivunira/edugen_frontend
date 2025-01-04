// src/api/content.ts
import apiClient from './client';
import { Subject, TopicResponse, TopicDetail, ChatMessage } from '../types/content';
import { Assessment, AssessmentResult, AssessmentSummary, QuestionFeedback } from '../types/assessment';


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
  },
  /**
   * Starts a new assessment for a specific topic
   * @param topicId - The ID of the topic
   * @returns Promise containing the assessment questions
   */
  startAssessment: async (topicId: number): Promise<Assessment> => {
    try {
      const response = await apiClient.post(`/tutor/assessments/${topicId}/start/`);
      return response.data;
    } catch (error) {
      console.error('Error starting assessment:', error);
      throw error;
    }
  },

  /**
   * Submits an answer for a question in an assessment
   * @param assessmentId - The ID of the assessment
   * @param questionId - The ID of the question
   * @param answer - The user's answer
   * @returns Promise containing the feedback for the answer
   */
  submitAnswer: async (
    assessmentId: number,
    questionId: number,
    answer: string
  ): Promise<QuestionFeedback> => {
    try {
      const response = await apiClient.post(`/tutor/assessments/${assessmentId}/submit/`, {
        questionId,
        answer
      });
      return {
        isCorrect: response.data.score === 1.0,
        score: response.data.score * 100,
        feedback: response.data.feedback
      };
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  },

  /**
   * Completes an assessment and gets final results
   * @param assessmentId - The ID of the assessment
   * @returns Promise containing the assessment results
   */
  completeAssessment: async (assessmentId: number): Promise<AssessmentResult> => {
    try {
      const response = await apiClient.post(`/tutor/assessments/${assessmentId}/complete/`);
      return {
        assessmentId: response.data.assessmentId,
        topicId: response.data.topicId,
        score: response.data.score,
        completedAt: response.data.completedAt,
        questionResults: response.data.questionResults
      };
    } catch (error) {
      console.error('Error completing assessment:', error);
      throw error;
    }
  },

  /**
   * Gets assessment summary for a topic
   * @param topicId - The ID of the topic
   * @returns Promise containing the assessment summary
   */
  getAssessmentSummary: async (topicId: number): Promise<AssessmentSummary> => {
    try {
      const response = await apiClient.get(`/tutor/assessments/${topicId}/summary/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment summary:', error);
      throw error;
    }
  },

  /**
   * Gets detailed results for a completed assessment
   * @param assessmentId - The ID of the assessment
   * @returns Promise containing the detailed assessment results
   */
  getAssessmentResults: async (assessmentId: number): Promise<AssessmentResult> => {
    try {
      const response = await apiClient.get(`/tutor/assessments/${assessmentId}/results/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment results:', error);
      throw error;
    }
  },

  /**
   * Gets user profile data including assessment history and performance metrics
   * @returns Promise containing the user's profile data
   */
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Updates user profile information
   * @param profileData - The profile data to update
   * @returns Promise containing the updated profile data
   */
  updateUserProfile: async (profileData: {
    first_name?: string;
    last_name?: string;
    profile_photo?: File;
  }) => {
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await apiClient.patch('/auth/profile/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};

export default contentApi;