import type { AnswerRecord, Question, QuizSettings, Section } from '../types';

export function sectionIdOf(q: Pick<Question, 'exam' | 'subsection'>): string {
  const major = q.subsection.split('.')[0];
  return `${q.exam}-${major}`;
}

/** 複数選択は完全一致のみ正解。単一選択も同じ判定で扱える */
export function isCorrect(question: Pick<Question, 'answer'>, selected: string[]): boolean {
  if (selected.length !== question.answer.length) return false;
  const expected = new Set(question.answer);
  return selected.every((id) => expected.has(id));
}

export function toggleSelection(
  type: Question['type'],
  current: string[],
  optionId: string,
): string[] {
  if (type === 'single') return [optionId];
  return current.includes(optionId)
    ? current.filter((id) => id !== optionId)
    : [...current, optionId];
}

export type Rng = () => number;

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function filterQuestions(questions: readonly Question[], settings: QuizSettings): Question[] {
  const sections = new Set(settings.sectionIds);
  return questions.filter((q) => {
    if (q.exam !== settings.exam) return false;
    if (sections.size > 0 && !sections.has(sectionIdOf(q))) return false;
    if (!settings.includeReview && q.tags?.includes('review')) return false;
    if (!settings.includeCaseStudies && q.caseStudyId) return false;
    return true;
  });
}

/**
 * 出題順を決める。ケーススタディ問題は同じ企業の問題が連続するようにまとめる。
 * count が全体より少ない場合は、ケーススタディ単位で丸ごと採用／不採用を決める。
 */
export function buildQuiz(
  questions: readonly Question[],
  settings: QuizSettings,
  rng: Rng = Math.random,
): Question[] {
  const pool = filterQuestions(questions, settings);
  const standalone = pool.filter((q) => !q.caseStudyId);
  const byCase = new Map<string, Question[]>();
  for (const q of pool) {
    if (!q.caseStudyId) continue;
    const list = byCase.get(q.caseStudyId) ?? [];
    list.push(q);
    byCase.set(q.caseStudyId, list);
  }
  const groups: Question[][] = [
    ...shuffle(standalone, rng).map((q) => [q]),
    ...shuffle([...byCase.values()], rng).map((g) => shuffle(g, rng)),
  ];
  const ordered = shuffle(groups, rng);
  const limit = settings.count > 0 ? settings.count : Number.POSITIVE_INFINITY;
  const result: Question[] = [];
  for (const group of ordered) {
    // ケーススタディは分割せず、残り枠に収まる場合のみ採用する
    if (result.length + group.length > limit) continue;
    result.push(...group);
    if (result.length >= limit) break;
  }
  return result;
}

export interface SectionStat {
  section: Section;
  attempts: number;
  correct: number;
  rate: number | null;
}

export function aggregateBySection(
  records: readonly AnswerRecord[],
  sections: readonly Section[],
): SectionStat[] {
  return sections.map((section) => {
    const rows = records.filter((r) => r.sectionId === section.id);
    const correct = rows.filter((r) => r.correct).length;
    return {
      section,
      attempts: rows.length,
      correct,
      rate: rows.length === 0 ? null : correct / rows.length,
    };
  });
}

export function overallRate(records: readonly AnswerRecord[]): number | null {
  if (records.length === 0) return null;
  return records.filter((r) => r.correct).length / records.length;
}

export function formatRate(rate: number | null): string {
  if (rate === null) return '--%';
  return `${Math.round(rate * 100)}%`;
}
