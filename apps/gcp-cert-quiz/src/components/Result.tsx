import { sectionsOf } from '../data/exams';
import { aggregateBySection, formatRate, overallRate } from '../lib/quiz';
import type { AnswerRecord, ExamId, Question } from '../types';
import { StatTable } from './StatTable';

interface Props {
  exam: ExamId;
  sessionRecords: readonly AnswerRecord[];
  questions: readonly Question[];
  onRetryWrong: () => void;
  onHome: () => void;
}

export function Result({ exam, sessionRecords, questions, onRetryWrong, onHome }: Props) {
  const stats = aggregateBySection(sessionRecords, sectionsOf(exam));
  const wrong = sessionRecords.filter((r) => !r.correct);
  const rate = overallRate(sessionRecords);
  const correctCount = sessionRecords.length - wrong.length;

  return (
    <>
      <section className="card">
        <h2>今回の結果</h2>
        <div className="big-score">{formatRate(rate)}</div>
        <p className="muted" style={{ textAlign: 'center' }}>
          {correctCount} / {sessionRecords.length} 問正解
        </p>
      </section>
      <section className="card">
        <h2>セクション別</h2>
        <StatTable stats={stats.filter((s) => s.attempts > 0)} />
      </section>
      {wrong.length > 0 && (
        <section className="card">
          <h2>間違えた問題</h2>
          <ol className="wrong-list">
            {wrong.map((r) => {
              const q = questions.find((x) => x.id === r.questionId);
              if (!q) return null;
              return (
                <li key={r.questionId}>
                  <span className="muted">[{q.subsection}] </span>
                  {q.question.length > 80 ? `${q.question.slice(0, 80)}…` : q.question}
                  <div className="muted">決め手: 「{q.keyPhrase}」</div>
                </li>
              );
            })}
          </ol>
        </section>
      )}
      <div className="action-bar">
        <div className="action-bar-inner">
          <button type="button" className="btn" onClick={onHome}>
            ホームへ
          </button>
          {wrong.length > 0 && (
            <button type="button" className="btn primary" onClick={onRetryWrong}>
              間違いだけ再挑戦
            </button>
          )}
        </div>
      </div>
    </>
  );
}
