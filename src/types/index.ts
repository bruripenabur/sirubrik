export type KKNILevel =
  | 'Level 6 (Sarjana / D4)'
  | 'Level 7 (Profesi)'
  | 'Level 8 (Magister / Spesialis)'
  | 'Level 9 (Doktor / Subspesialis)';

export type EvaluationCategory =
  | 'case_method'
  | 'team_project'
  | 'structured_task'
  | 'quiz'
  | 'uts'
  | 'uas'
  | 'field_work'
  | 'participatory';

export type EvaluationModelType = 'model_1' | 'model_2' | 'model_3' | 'custom';

export interface CPMKItem {
  id: string;
  code: string;
  desc: string;
}

export interface CourseIdentity {
  name: string;
  code: string;
  sks: number;
  semester: number;
  level: KKNILevel;
  faculty: string;
  studyProgram: string;
  lecturer: string;
  cpmkList: CPMKItem[];
  pipFocus: string;
  sdgsAlignment: string[];
  cqiNotes?: string;
}

export interface EvaluationComponent {
  id: string;
  name: string;
  category: EvaluationCategory;
  weight: number; // percentage
  subCpmkList: string[];
  bloomLevels: string[];
  suggestedWeeks: string;
  description?: string;
  status: 'pending' | 'drafting' | 'drafted' | 'approved';
}

export interface RubricLevel {
  grade: string;
  scoreRange: string;
  descriptor: string;
  numericMin: number;
  numericMax: number;
}

export interface RubricCriterion {
  id: string;
  aspect: string;
  weight: number; // percentage
  cpmkMapping?: string; // e.g. "CPMK 1 / Sub-CPMK 1.1"
  levels: RubricLevel[];
}

export interface ComponentInstrument {
  componentId: string;
  taskDetails: {
    name: string;
    taskType: string;
    subCpmk: string;
    indicators: string[];
    pipSdgsRelevance: string;
    instructions: string;
    deadline: string;
    targetObject: string;
    caseOrProblemText: string;
  };
  rubric: {
    type: 'analytic' | 'holistic';
    scaleType: 'sarjana' | 'pascasarjana';
    criteria: RubricCriterion[];
  };
  calculationFormula: string;
  consultantRecommendation?: string;
  isApproved?: boolean;
}

export type WorkflowStage =
  | 'stage_1_mapping'
  | 'stage_2_revision'
  | 'stage_3_drafting'
  | 'dossier_complete';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  actionPrompt?: string;
}

export interface GradeScaleDefinition {
  grade: string;
  minScore: number;
  maxScore: number;
  gradePoint: number;
  predicate: string;
  level: 'sarjana' | 'pascasarjana';
}

export interface CplItem {
  code: string;
  desc: string;
  targetBenchmark: number; // e.g. 75%
  mappedCpmks: string[];
}

export interface TrilogyBridgeData {
  sourceApp: 'desain-rpsobe' | 'simpel-cpl';
  syncedAt: string;
  courseIdentity: Partial<CourseIdentity>;
  cplList: CplItem[];
  cpmkList: CPMKItem[];
  historicalCqiDeltaGap?: {
    cpmkCode: string;
    gapPercentage: number;
    notes: string;
  }[];
}

export interface StudentCompetencyRecord {
  studentId: string;
  studentName: string;
  subCpmkScores: {
    subCpmkCode: string;
    score: number; // 0-100
    target: number; // e.g. 75
    bloomLevel: string;
    feedback: string;
  }[];
  overallCpmkAchievement: {
    cpmkCode: string;
    actualScore: number;
    targetScore: number;
    isAchieved: boolean;
  }[];
}

export interface SpmiAuditResult {
  overallScore: number; // 0 - 100
  bloomMeasurabilityScore: number;
  pasal47ComplianceScore: number;
  pipBmkIntegrationScore: number;
  findings: {
    componentId: string;
    componentName: string;
    aspect: string;
    issueType: 'vague_kko' | 'pasal47_warning' | 'kkni_depth_mismatch' | 'pip_opportunity';
    originalText: string;
    suggestedText: string;
    explanation: string;
  }[];
}

