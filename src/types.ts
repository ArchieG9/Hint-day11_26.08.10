export type AnchorCode = 'TF' | 'GM' | 'AU' | 'SE' | 'EC' | 'SV' | 'CH' | 'LS';

export interface CareerAnchorInfo {
  code: AnchorCode;
  title: string;
  koreanTitle: string;
  englishTitle: string;
  summary: string;
  description: string;
  keyValues: string[];
  idealRoles: string[];
  color: string;
  bgLight: string;
  iconName: string;
}

export interface DiagnosticQuestion {
  id: number;
  anchor: AnchorCode;
  text: string;
}

export interface AnswersState {
  [questionId: number]: number; // 1 to 4 points
}

export type AnchorScores = {
  [key in AnchorCode]: number;
};

export interface JobInputData {
  targetJob: string;
  industry: string;
  concerns: string[];
}

export interface AIReportData {
  jobSynergy: string;
  resumeKeywords: Array<{
    keyword: string;
    englishKeyword: string;
    description: string;
  }>;
  careerCaution: string;
  recommendedRoles: string[];
  growthActionPlan: string[];
  overallSummary: string;
}

export interface DiagnosticResult {
  id: string;
  timestamp: number;
  scores: AnchorScores;
  primaryAnchor: AnchorCode;
  secondaryAnchor: AnchorCode;
  jobInput: JobInputData;
  aiReport?: AIReportData;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}
