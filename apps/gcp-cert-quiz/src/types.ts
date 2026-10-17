export type ExamId = 'pcse' | 'pca';

export interface Exam {
  id: ExamId;
  code: string;
  name: string;
  guideUrl: string;
  description: string;
}

export interface Section {
  id: string;
  exam: ExamId;
  number: number;
  /** 公式試験ガイドのセクション名（日本語） */
  title: string;
  /** 公式試験ガイドのセクション名（英語） */
  titleEn: string;
  /** 公式ガイド記載の出題比率 */
  weight: string;
  /** 受験者の弱点として重点出題する領域 */
  focus?: boolean;
}

export interface Subsection {
  id: string;
  sectionId: string;
  /** 例: "2.2" */
  number: string;
  title: string;
}

export interface CaseStudy {
  id: string;
  exam: ExamId;
  name: string;
  officialUrl: string;
  overview: string;
  solutionConcept: string;
  existingEnvironment: string[];
  businessRequirements: string[];
  technicalRequirements: string[];
  executiveStatement: string;
}

export type QuestionType = 'single' | 'multiple';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  exam: ExamId;
  /** 公式ガイドのサブセクション番号 例: "2.2" */
  subsection: string;
  type: QuestionType;
  caseStudyId?: string;
  question: string;
  options: Option[];
  /** 正解の option.id。複数選択は完全一致でのみ正解 */
  answer: string[];
  /** 要件中の決め手となる語句（question 内の文字列と一致させる） */
  keyPhrase: string;
  /** なぜその語句が決め手になるか・正解の根拠 */
  explanation: string;
  /** 不正解選択肢がなぜ不適切か */
  whyNot?: Record<string, string>;
  /** 'review' = 既に解いた問題の復習用 */
  tags?: string[];
}

export interface AnswerRecord {
  questionId: string;
  exam: ExamId;
  sectionId: string;
  correct: boolean;
  answeredAt: number;
}

export interface QuizSettings {
  exam: ExamId;
  sectionIds: string[];
  count: number;
  includeReview: boolean;
  includeCaseStudies: boolean;
}
