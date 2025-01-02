export interface Subject {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  topicCount: number;
}

export interface TopicDetail {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    subjectId: number;
}

export interface TopicResponse {
    subject: {
        id: number;
        name: string;
        description: string | null;
        imageUrl: string | null;
    };
    topics: TopicDetail[];
}

export interface ChatMessage {
  id: number;
  prompt: string;
  response: string;
  timestamp: string;
}

export interface ChatResponse {
    id: number;
    prompt: string;
    response: string;
    timestamp: string;
}