// src/types/profile.ts

export interface RecentAssessment {
  id: number;
  score: number;
  date: string;
}

export interface TopicPerformance {
  topic_id: number;
  topic_name: string;
  subject_name: string;
  total_attempts: number;
  best_score: number;
  average_score: number;
  last_attempt_date: string;
  recent_assessments: RecentAssessment[];
}

export interface UnattemptedTopic {
  id: number;
  name: string;
  subject__name: string;
}

export interface OverallStats {
  total_assessments: number;
  average_score: number;
}

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  grade: string;
  profile_photo: string | null;
  date_joined: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  profile_photo?: File;
}

export interface ProfileData {
  user: UserProfile;
  overall_stats: OverallStats;
  topic_performance: TopicPerformance[];
  unattempted_topics: UnattemptedTopic[];
}