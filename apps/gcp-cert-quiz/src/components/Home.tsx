import { exams, sectionsOf } from '../data/exams';
import { aggregateBySection, filterQuestions, formatRate, sectionIdOf } from '../lib/quiz';
import type { AnswerRecord, ExamId, Question, QuizSettings } from '../types';

interface Props {
  settings: QuizSettings;
  questions: readonly Question[];
  records: readonly AnswerRecord[];
  onChange: (settings: QuizSettings) => void;
  onStart: () => void;
  onShowStats: () => void;
}

const COUNT_OPTIONS = [10, 20, 30, 0] as const;

export function Home({ settings, questions, records, onChange, onStart, onShowStats }: Props) {
  const exam = exams.find((e) => e.id === settings.exam) ?? exams[0];
  const examSections = sectionsOf(settings.exam);
  const examRecords = records.filter((r) => r.exam === settings.exam);
  const stats = aggregateBySection(examRecords, examSections);
  const available = filterQuestions(questions, settings).length;
  const examQuestions = questions.filter((q) => q.exam === settings.exam);
  const hasCaseStudies = examQuestions.some((q) => q.caseStudyId);
  const hasReview = examQuestions.some((q) => q.tags?.includes('review'));

  const setExam = (id: ExamId) => onChange({ ...settings, exam: id, sectionIds: [] });
  const toggleSection = (id: string) => {
    const next = settings.sectionIds.includes(id)
      ? settings.sectionIds.filter((s) => s !== id)
      : [...settings.sectionIds, id];
    onChange({ ...settings, sectionIds: next });
  };

  return (
    <>
      <section className="card">
        <h2>試験を選ぶ</h2>
        <div className="exam-tabs">
          {exams.map((e) => (
            <button
              key={e.id}
              type="button"
              className={`exam-tab${e.id === settings.exam ? ' active' : ''}`}
              onClick={() => setExam(e.id)}
            >
              <span className="code">{e.code}</span>
              <span className="name">{e.name}</span>
            </button>
          ))}
        </div>
        <p className="muted">{exam.description}</p>
        <p className="muted">
          <a href={exam.guideUrl} target="_blank" rel="noreferrer">
            公式試験ガイド
          </a>
        </p>
      </section>

      <section className="card">
        <div className="row between">
          <h2>出題セクション</h2>
          <button
            type="button"
            className="link-button"
            onClick={() => onChange({ ...settings, sectionIds: [] })}
          >
            すべて
          </button>
        </div>
        <p className="muted">未選択のときは全セクションから出題します。</p>
        <div className="section-list">
          {examSections.map((section) => {
            const stat = stats.find((s) => s.section.id === section.id);
            const total = examQuestions.filter((q) => sectionIdOf(q) === section.id).length;
            const checked = settings.sectionIds.includes(section.id);
            return (
              <label key={section.id} className="section-item">
                <input type="checkbox" checked={checked} onChange={() => toggleSection(section.id)} />
                <div>
                  <div className="title">
                    {section.number}. {section.title}
                  </div>
                  <div className="meta">
                    <span>配点 {section.weight}</span>
                    <span>{total}問</span>
                    <span>正答率 {formatRate(stat?.rate ?? null)}</span>
                    {section.focus && <span className="badge">重点</span>}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2>出題数</h2>
        <div className="chip-group">
          {COUNT_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              className={`chip${settings.count === count ? ' active' : ''}`}
              onClick={() => onChange({ ...settings, count })}
            >
              {count === 0 ? '全問' : `${count}問`}
            </button>
          ))}
        </div>
        {hasReview && (
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.includeReview}
              onChange={(e) => onChange({ ...settings, includeReview: e.target.checked })}
            />
            <span>既に解いた問題（復習用）も含める</span>
          </label>
        )}
        {hasCaseStudies && (
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.includeCaseStudies}
              onChange={(e) => onChange({ ...settings, includeCaseStudies: e.target.checked })}
            />
            <span>ケーススタディ問題を含める</span>
          </label>
        )}
        <p className="muted">条件に合う問題: {available}問</p>
      </section>

      <div className="action-bar">
        <div className="action-bar-inner">
          <button type="button" className="btn" onClick={onShowStats}>
            成績
          </button>
          <button type="button" className="btn primary" onClick={onStart} disabled={available === 0}>
            開始
          </button>
        </div>
      </div>
    </>
  );
}
