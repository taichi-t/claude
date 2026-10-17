import { formatRate, type SectionStat } from '../lib/quiz';

interface Props {
  stats: SectionStat[];
}

function barClass(rate: number | null): string {
  if (rate === null) return '';
  if (rate < 0.6) return 'low';
  if (rate < 0.8) return 'mid';
  return '';
}

export function StatTable({ stats }: Props) {
  return (
    <table className="stat-table">
      <thead>
        <tr>
          <th>セクション</th>
          <th className="num">正答率</th>
        </tr>
      </thead>
      <tbody>
        {stats.map(({ section, attempts, correct, rate }) => (
          <tr key={section.id}>
            <td>
              <div>
                {section.number}. {section.title}
              </div>
              <div className="bar">
                <div className={barClass(rate)} style={{ width: `${(rate ?? 0) * 100}%` }} />
              </div>
            </td>
            <td className="num">
              <div>{formatRate(rate)}</div>
              <div className="muted">
                {correct}/{attempts}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
