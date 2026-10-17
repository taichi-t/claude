import { useEffect, useMemo, useState } from 'react';
import { Home } from './components/Home';
import { QuestionView } from './components/QuestionView';
import { Result } from './components/Result';
import { Stats } from './components/Stats';
import { caseStudies } from './data/caseStudies';
import { questions } from './data/questions';
import { buildQuiz, sectionIdOf } from './lib/quiz';
import { clearRecords, loadRecords, loadSettings, saveRecords, saveSettings } from './lib/storage';
import type { AnswerRecord, Question, QuizSettings } from './types';

type Screen = 'home' | 'quiz' | 'result' | 'stats';

const DEFAULT_SETTINGS: QuizSettings = {
  exam: 'pcse',
  sectionIds: [],
  count: 10,
  includeReview: true,
  includeCaseStudies: true,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState<QuizSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...loadSettings(),
  }));
  const [records, setRecords] = useState<AnswerRecord[]>(() => loadRecords());
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [session, setSession] = useState<AnswerRecord[]>([]);

  useEffect(() => saveSettings(settings), [settings]);
  useEffect(() => saveRecords(records), [records]);

  const startWith = (list: Question[]) => {
    if (list.length === 0) return;
    setQuiz(list);
    setIndex(0);
    setSession([]);
    setScreen('quiz');
    window.scrollTo({ top: 0 });
  };

  const start = () => startWith(buildQuiz(questions, settings));

  const retryWrong = () => {
    const wrongIds = new Set(session.filter((r) => !r.correct).map((r) => r.questionId));
    startWith(quiz.filter((q) => wrongIds.has(q.id)));
  };

  const current = quiz[index];
  const caseStudy = useMemo(
    () => (current?.caseStudyId ? caseStudies.find((c) => c.id === current.caseStudyId) : undefined),
    [current],
  );
  const previous = index > 0 ? quiz[index - 1] : undefined;
  const caseStudyJustStarted = Boolean(current?.caseStudyId) && previous?.caseStudyId !== current?.caseStudyId;

  const handleAnswered = (correct: boolean) => {
    const record: AnswerRecord = {
      questionId: current.id,
      exam: current.exam,
      sectionId: sectionIdOf(current),
      correct,
      answeredAt: Date.now(),
    };
    setSession((s) => [...s, record]);
    setRecords((r) => [...r, record]);
  };

  const handleNext = () => {
    if (index + 1 < quiz.length) {
      setIndex(index + 1);
      window.scrollTo({ top: 0 });
    } else {
      setScreen('result');
      window.scrollTo({ top: 0 });
    }
  };

  const quit = () => {
    if (session.length === 0 || window.confirm('中断して結果を表示しますか？')) {
      setScreen(session.length === 0 ? 'home' : 'result');
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>GCP 認定クイズ</h1>
          <div className="sub">PCSE / PCA 対策</div>
        </div>
        {screen === 'quiz' && current && (
          <span className="badge primary">{current.exam.toUpperCase()}</span>
        )}
      </header>

      {screen === 'home' && (
        <Home
          settings={settings}
          questions={questions}
          records={records}
          onChange={setSettings}
          onStart={start}
          onShowStats={() => setScreen('stats')}
        />
      )}

      {screen === 'quiz' && current && (
        <QuestionView
          key={current.id}
          question={current}
          index={index}
          total={quiz.length}
          caseStudy={caseStudy}
          showCaseStudyOpen={caseStudyJustStarted}
          onAnswered={handleAnswered}
          onNext={handleNext}
          onQuit={quit}
        />
      )}

      {screen === 'result' && (
        <Result
          exam={settings.exam}
          sessionRecords={session}
          questions={quiz}
          onRetryWrong={retryWrong}
          onHome={() => setScreen('home')}
        />
      )}

      {screen === 'stats' && (
        <Stats
          records={records}
          onReset={() => {
            clearRecords();
            setRecords([]);
          }}
          onHome={() => setScreen('home')}
        />
      )}
    </div>
  );
}
