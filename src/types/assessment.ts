// src/types/assessment.ts

export interface Question {
    id: number;
    question_text: string;
    difficulty: 'easy' | 'medium' | 'hard';
    is_active: boolean;
}

export interface Assessment {
    id: number;
    topic_id: number;
    topic_name: string;
    questions: Question[];
    start_time: string;
    status: string;
    total_score: number | null;
}

export interface StudentAnswer {
    assessment: number;
    question: number;
    answer_text: string;
    score: number;
    feedback: string;
}

export interface QuestionFeedback {
    isCorrect: boolean;
    score: number;
    feedback: string;
}

export interface AssessmentResult {
    assessmentId: number;
    topicId: number;
    score: number;
    completedAt: string;
    questionResults: {
        questionId: number;
        questionText: string;
        score: number;
        isCorrect: boolean;
        userAnswer: string;
        feedback: string;
    }[];
}

export interface AssessmentSummary {
    id: number;
    topic_id: number;
    topic_name: string;
    total_attempts: number;
    best_score: number;
    last_score: number;
    last_attempt_date: string;
    average_score: number;
}

export interface AssessmentState {
    currentAssessment: Assessment | null;
    currentQuestionIndex: number;
    answers: Record<number, string>;
    feedback: Record<number, QuestionFeedback>;
    results: AssessmentResult | null;
    topicSummaries: Record<number, AssessmentSummary>;
    loading: boolean;
    error: string | null;
}

export interface SubmitAnswerPayload {
  assessmentId: number;
  questionId: number;
  answer: string;
}