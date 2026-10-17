import { describe, expect, it } from 'vitest';
import { caseStudies } from './caseStudies';
import { findSubsection, sectionsOf } from './exams';
import { questions } from './questions';
import { sectionIdOf } from '../lib/quiz';

describe('問題データの整合性', () => {
  it('ID が一意', () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('正解の記号が選択肢に存在し、単一／複数選択と正解数が一致する', () => {
    for (const q of questions) {
      const ids = new Set(q.options.map((o) => o.id));
      for (const a of q.answer) expect(ids.has(a), `${q.id}: answer ${a}`).toBe(true);
      expect(new Set(q.answer).size, `${q.id}: duplicate answer`).toBe(q.answer.length);
      if (q.type === 'single') expect(q.answer.length, `${q.id}: single`).toBe(1);
      else expect(q.answer.length, `${q.id}: multiple`).toBeGreaterThanOrEqual(2);
      expect(q.options.length, `${q.id}: options`).toBeGreaterThanOrEqual(3);
    }
  });

  it('決め手の語句が問題文に含まれる', () => {
    const missing = questions
      .filter((q) => !q.question.includes(q.keyPhrase))
      .map((q) => `${q.id}: "${q.keyPhrase}"`);
    expect(missing).toEqual([]);
  });

  it('サブセクションが公式ガイドの項目に対応する', () => {
    for (const q of questions) {
      expect(findSubsection(q.exam, q.subsection), `${q.id}: ${q.subsection}`).toBeDefined();
    }
  });

  it('ケーススタディ ID が存在し、試験が一致する', () => {
    for (const q of questions) {
      if (!q.caseStudyId) continue;
      const cs = caseStudies.find((c) => c.id === q.caseStudyId);
      expect(cs, `${q.id}: ${q.caseStudyId}`).toBeDefined();
      expect(cs?.exam).toBe(q.exam);
    }
  });

  it('whyNot は不正解の選択肢のみを対象にする', () => {
    for (const q of questions) {
      for (const id of Object.keys(q.whyNot ?? {})) {
        expect(q.options.some((o) => o.id === id), `${q.id}: whyNot ${id}`).toBe(true);
        expect(q.answer.includes(id), `${q.id}: whyNot on answer ${id}`).toBe(false);
      }
    }
  });

  it('各試験のすべてのセクションに問題がある', () => {
    for (const exam of ['pcse', 'pca'] as const) {
      for (const section of sectionsOf(exam)) {
        const n = questions.filter((q) => sectionIdOf(q) === section.id).length;
        expect(n, section.id).toBeGreaterThan(0);
      }
    }
  });

  it('各ケーススタディに複数の問題が紐づく', () => {
    for (const cs of caseStudies) {
      const n = questions.filter((q) => q.caseStudyId === cs.id).length;
      expect(n, cs.id).toBeGreaterThanOrEqual(3);
    }
  });
});
