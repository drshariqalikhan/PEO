// Define the PEO model structure
export interface PEOProfile {
  patient: { required: Record<string, any>; recommended: Record<string, any>; optional: Record<string, any> };
  exposure: { required: Record<string, any>; recommended: Record<string, any>; optional: Record<string, any> };
  outcome: { required: Record<string, any>; recommended: Record<string, any>; optional: Record<string, any> };
}

// Define the PubMed search structures 
export interface PubMedQueries {
  high_precision: string;
  expanded: string;
  broad: string;
  mesh: string;
}

// Define the Analysis Response
export interface AnalysisResponse {
  question_type: 'therapy' | 'harm' | 'prognosis' | 'diagnosis' | 'prevention' | 'screening' | 'etiology';
  search_readiness_score: number;
  draft_peo: PEOProfile;
  missing_fields: Array<{ field: string; importance: string; reason: string }>;
  clarification_questions: Array<{ 
    id: string; 
    field: string; 
    importance: string; 
    question: string; 
    reason: string; 
    options: string[] 
  }>;
  final_peo: PEOProfile | null;
  pubmed_queries: PubMedQueries | null;
}