export type EnrichmentStatus = 'draft' | 'needs_review' | 'approved' | 'published';

export interface KnowledgeArticle {
  source: 'manual' | 'salesforce' | 'mock';
  articleNumber?: string;
  url?: string;
  title: string;
  body: string;
  product?: string;
  lastModified?: string;
}

export interface AiKnowledgeLayer {
  sourceArticleTitle: string;
  sourceArticleNumber?: string;
  status: EnrichmentStatus;
  customerIntent: string;
  customerPhrases: string[];
  symptoms: string[];
  commonErrorMessages: string[];
  claireSearchTerms: string[];
  customerSafeSummary: string;
  discoveryQuestions: string[];
  claireCanTry: string[];
  doNotSayOrAttempt: string[];
  escalationTriggers: string[];
  routingRecommendation: string;
  requiredSalesforceFields: string[];
  caseSummaryTemplate: string;
  confidenceScore: number;
  reviewerQuestions: string[];
}
