import { exams, sectionsOf } from '../data/exams';
import { aggregateBySection, formatRate, overallRate } from '../lib/quiz';
import type { AnswerRecord } from '../types';
import { StatTable } from './StatTable';

interface Props {
  records: readonly AnswerRecord[];
  onReset: () => void;
  onHome: () => void;
}

export function Stats({ records, onReset, onHome }: Props) {
  return (
    <>
      {exams.map((exam) => {
        const examRecords = records.filter((r) => r.exam === exam.id);
        const stats = aggregateBySection(examRecords, sectionsOf(exam.id));
        return (
          <section className="card" key={exam.id}>
            <div className="row between">
              <h2>{exam.code}</h2>
              <span>
                累計 {formatRate(overallRate(examRecords))}{' '}
                <span className="muted">({examRecords.length}問)</span>
              </span>
            </div>
            <StatTable stats={stats} />
          </section>
        );
      })}
      <p className="muted">成績はこの端末のブラウザにのみ保存されます。</p>
      <div className="action-bar">
        <div className="action-bar-inner">
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (window.confirm('成績をすべて削除しますか？')) onReset();
            }}
            disabled={records.length === 0}
          >
            成績をリセット
          </button>
          <button type="button" className="btn primary" onClick={onHome}>
            ホームへ
          </button>
        </div>
      </div>
    </>
  );
}
