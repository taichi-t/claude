import { describe, expect, it } from 'vitest';
import type { AnswerRecord, Question, QuizSettings, Section } from '../types';
import {
  aggregateBySection,
  buildQuiz,
  filterQuestions,
  isCorrect,
  sectionIdOf,
  toggleSelection,
} from './quiz';

const q = (overrides: Partial<Question> & Pick<Question, 'id'>): Question => ({
  exam: 'pcse',
  subsection: '1.1',
  type: 'single',
  question: 'Q',
  options: [
    { id: 'A', text: 'a' },
    { id: 'B', text: 'b' },
    { id: 'C', text: 'c' },
  ],
  answer: ['A'],
  keyPhrase: 'k',
  explanation: 'e',
  ...overrides,
});

describe('isCorrect', () => {
  it('単一選択は正解IDと一致した場合のみ正解', () => {
    expect(isCorrect({ answer: ['B'] }, ['B'])).toBe(true);
    expect(isCorrect({ answer: ['B'] }, ['A'])).toBe(false);
    expect(isCorrect({ answer: ['B'] }, [])).toBe(false);
  });

  it('複数選択は完全一致のみ正解（部分一致・過剰選択は不正解）', () => {
    expect(isCorrect({ answer: ['A', 'C'] }, ['C', 'A'])).toBe(true);
    expect(isCorrect({ answer: ['A', 'C'] }, ['A'])).toBe(false);
    expect(isCorrect({ answer: ['A', 'C'] }, ['A', 'B', 'C'])).toBe(false);
    expect(isCorrect({ answer: ['A', 'C'] }, ['A', 'B'])).toBe(false);
  });
});

describe('toggleSelection', () => {
  it('単一選択は置き換える', () => {
    expect(toggleSelection('single', ['A'], 'B')).toEqual(['B']);
  });
  it('複数選択はトグルする', () => {
    expect(toggleSelection('multiple', ['A'], 'B')).toEqual(['A', 'B']);
    expect(toggleSelection('multiple', ['A', 'B'], 'A')).toEqual(['B']);
  });
});

describe('sectionIdOf', () => {
  it('サブセクション番号の整数部からセクションIDを導く', () => {
    expect(sectionIdOf({ exam: 'pca', subsection: '3.2' })).toBe('pca-3');
  });
});

const settings: QuizSettings = {
  exam: 'pcse',
  sectionIds: [],
  count: 0,
  includeReview: true,
  includeCaseStudies: true,
};

describe('filterQuestions', () => {
  const pool = [
    q({ id: '1', subsection: '1.1' }),
    q({ id: '2', subsection: '2.1' }),
    q({ id: '3', subsection: '2.2', tags: ['review'] }),
    q({ id: '4', exam: 'pca', subsection: '1.1', caseStudyId: 'ehr' }),
  ];
  it('試験で絞る', () => {
    expect(filterQuestions(pool, settings).map((x) => x.id)).toEqual(['1', '2', '3']);
  });
  it('セクションで絞る', () => {
    expect(
      filterQuestions(pool, { ...settings, sectionIds: ['pcse-2'] }).map((x) => x.id),
    ).toEqual(['2', '3']);
  });
  it('復習問題を除外できる', () => {
    expect(filterQuestions(pool, { ...settings, includeReview: false }).map((x) => x.id)).toEqual([
      '1',
      '2',
    ]);
  });
  it('ケーススタディ問題を除外できる', () => {
    expect(
      filterQuestions(pool, { ...settings, exam: 'pca', includeCaseStudies: false }),
    ).toEqual([]);
  });
});

describe('buildQuiz', () => {
  const seq = (values: number[]) => {
    let i = 0;
    return () => values[i++ % values.length];
  };
  const pool = [
    q({ id: 's1' }),
    q({ id: 's2' }),
    q({ id: 'c1', caseStudyId: 'x' }),
    q({ id: 'c2', caseStudyId: 'x' }),
    q({ id: 'c3', caseStudyId: 'x' }),
    q({ id: 'd1', caseStudyId: 'y' }),
  ];

  it('同じケーススタディの問題は連続して出題される', () => {
    const quiz = buildQuiz(pool, settings, seq([0.3, 0.7, 0.1, 0.9, 0.5]));
    const ids = quiz.map((x) => x.id);
    expect(ids).toHaveLength(6);
    const xs = ids.map((id, i) => (id.startsWith('c') ? i : -1)).filter((i) => i >= 0);
    expect(xs[xs.length - 1] - xs[0]).toBe(2);
  });

  it('出題数の上限を守り、ケーススタディは分割しない', () => {
    for (const seed of [0.1, 0.4, 0.8]) {
      const quiz = buildQuiz(pool, { ...settings, count: 3 }, seq([seed, 0.6, 0.2]));
      expect(quiz.length).toBeLessThanOrEqual(3);
      const cCount = quiz.filter((x) => x.caseStudyId === 'x').length;
      expect([0, 3]).toContain(cCount);
    }
  });

  it('count=0 は全問出題', () => {
    expect(buildQuiz(pool, settings, seq([0.5]))).toHaveLength(6);
  });
});

describe('aggregateBySection', () => {
  const sections: Section[] = [
    { id: 'pcse-1', exam: 'pcse', number: 1, title: 'A', titleEn: 'A', weight: '25%' },
    { id: 'pcse-2', exam: 'pcse', number: 2, title: 'B', titleEn: 'B', weight: '22%' },
  ];
  const rec = (sectionId: string, correct: boolean): AnswerRecord => ({
    questionId: 'q',
    exam: 'pcse',
    sectionId,
    correct,
    answeredAt: 0,
  });
  it('セクション別に正答率を集計し、未回答は null', () => {
    const stats = aggregateBySection(
      [rec('pcse-1', true), rec('pcse-1', false), rec('pcse-1', true)],
      sections,
    );
    expect(stats[0]).toMatchObject({ attempts: 3, correct: 2 });
    expect(stats[0].rate).toBeCloseTo(2 / 3);
    expect(stats[1]).toMatchObject({ attempts: 0, correct: 0, rate: null });
  });
});
