import type { ExamId, Question, QuestionType } from '../types';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export interface QuestionInput {
  id: string;
  /** 公式ガイドのサブセクション番号 例: "2.2" */
  sub: string;
  type?: QuestionType;
  caseStudy?: string;
  q: string;
  /** 選択肢。A, B, C ... の順に割り当てる */
  opts: string[];
  /** 正解の記号。複数選択は配列 */
  ans: string | string[];
  key: string;
  exp: string;
  why?: Record<string, string>;
  tags?: string[];
}

export function defineQuestions(exam: ExamId, inputs: QuestionInput[]): Question[] {
  return inputs.map((input) => {
    const answer = Array.isArray(input.ans) ? input.ans : [input.ans];
    return {
      id: `${exam}-${input.id}`,
      exam,
      subsection: input.sub,
      type: input.type ?? (answer.length > 1 ? 'multiple' : 'single'),
      caseStudyId: input.caseStudy,
      question: input.q,
      options: input.opts.map((text, i) => ({ id: LETTERS[i], text })),
      answer,
      keyPhrase: input.key,
      explanation: input.exp,
      whyNot: input.why,
      tags: input.tags,
    };
  });
}
