
export enum IncidentPriority {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
}

export interface Portfolio {
  id: string;
  name: string;
}

export interface IncidentComment {
  author: string;
  timestamp: string;
  comment: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  priority: IncidentPriority;
  portfolioId: string;
  slaBreachTime: string; 
  affectedServices: string[];
  lastUpdate: string;
  commentHistory: IncidentComment[];
  aiSummary?: string;
  isSummarizing?: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
}

export interface IncidentTimelineEvent {
    step: string;
    description: string;
}

export interface SuggestedArticle {
    id: string;
    title: string;
    summary: string;
    relevance: string;
}

export interface AIAnalysisResult {
  nextSteps: string[];
  rootCause: string;
  suggestedArticles: SuggestedArticle[];
  timeline: IncidentTimelineEvent[];
}
