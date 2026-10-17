import { useState } from 'react';
import { findSection, findSubsection } from '../data/exams';
import { isCorrect, toggleSelection, sectionIdOf } from '../lib/quiz';
import type { CaseStudy, Question } from '../types';
import { CaseStudyPanel } from './CaseStudyPanel';
import { Highlight } from './Highlight';

interface Props {
  question: Question;
  index: number;
  total: number;
  caseStudy?: CaseStudy;
  showCaseStudyOpen: boolean;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
  onQuit: () => void;
}

export function QuestionView({
  question,
  index,
  total,
  caseStudy,
  showCaseStudyOpen,
  onAnswered,
  onNext,
  onQuit,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const section = findSection(sectionIdOf(question));
  const subsection = findSubsection(question.exam, question.subsection);
  const correct = submitted && isCorrect(question, selected);
  const answerSet = new Set(question.answer);

  const submit = () => {
    if (selected.length === 0) return;
    setSubmitted(true);
    onAnswered(isCorrect(question, selected));
  };

  const next = () => {
    setSelected([]);
    setSubmitted(false);
    onNext();
  };

  return (
    <>
      <div className="progress">
        <div style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <div className="question-meta">
        <span>
          {index + 1} / {total}
        </span>
        {section && (
          <span className="badge primary">
            {section.number}. {section.title}
          </span>
        )}
        {subsection && (
          <span>
            {subsection.number} {subsection.title}
          </span>
        )}
        <span className="badge">{question.type === 'multiple' ? '複数選択' : '単一選択'}</span>
        {question.tags?.includes('review') && <span className="badge success">復習</span>}
      </div>

      {caseStudy && <CaseStudyPanel caseStudy={caseStudy} defaultOpen={showCaseStudyOpen} />}

      <div className="card">
        <p className="question-text">
          <Highlight text={question.question} phrase={submitted ? question.keyPhrase : undefined} />
        </p>
        {question.type === 'multiple' && (
          <p className="muted">
            正解は {question.answer.length} つ。すべて選んだ場合のみ正解になります。
          </p>
        )}
        <ul className="options">
          {question.options.map((option) => {
            const isSelected = selected.includes(option.id);
            const isAnswer = answerSet.has(option.id);
            let cls = `option ${question.type}`;
            if (submitted) {
              if (isAnswer) cls += ' correct';
              else if (isSelected) cls += ' wrong';
            } else if (isSelected) {
              cls += ' selected';
            }
            return (
              <li key={option.id}>
                <button
                  type="button"
                  className={cls}
                  disabled={submitted}
                  onClick={() => setSelected(toggleSelection(question.type, selected, option.id))}
                  aria-pressed={isSelected}
                >
                  <span className="key">{option.id}</span>
                  <span>
                    {option.text}
                    {submitted && !isAnswer && question.whyNot?.[option.id] && (
                      <span className="why">{question.whyNot[option.id]}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {submitted && (
          <>
            <div className={`verdict ${correct ? 'correct' : 'wrong'}`}>
              {correct ? '正解' : `不正解（正解: ${question.answer.join(', ')}）`}
            </div>
            <div className="key-phrase">
              決め手: 「{question.keyPhrase}」
            </div>
            <p className="explanation">{question.explanation}</p>
          </>
        )}
      </div>

      <div className="action-bar">
        <div className="action-bar-inner">
          <button type="button" className="btn" onClick={onQuit}>
            中断
          </button>
          {submitted ? (
            <button type="button" className="btn primary" onClick={next}>
              {index + 1 < total ? '次へ' : '結果を見る'}
            </button>
          ) : (
            <button
              type="button"
              className="btn primary"
              onClick={submit}
              disabled={selected.length === 0}
            >
              回答する
            </button>
          )}
        </div>
      </div>
    </>
  );
}
