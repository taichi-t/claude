import type { CaseStudy } from '../types';

interface Props {
  caseStudy: CaseStudy;
  defaultOpen?: boolean;
}

export function CaseStudyPanel({ caseStudy, defaultOpen }: Props) {
  return (
    <details className="case-study" open={defaultOpen}>
      <summary>ケーススタディ: {caseStudy.name}</summary>
      <div className="body">
        <h4>企業概要</h4>
        <p>{caseStudy.overview}</p>
        <h4>ソリューションのコンセプト</h4>
        <p>{caseStudy.solutionConcept}</p>
        <h4>既存の技術環境</h4>
        <ul>
          {caseStudy.existingEnvironment.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h4>ビジネス要件</h4>
        <ul>
          {caseStudy.businessRequirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h4>技術要件</h4>
        <ul>
          {caseStudy.technicalRequirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h4>経営陣の声明</h4>
        <p>{caseStudy.executiveStatement}</p>
        <p className="muted">
          本文は公式ケーススタディの要約です。原文:{' '}
          <a href={caseStudy.officialUrl} target="_blank" rel="noreferrer">
            公式 PDF
          </a>
        </p>
      </div>
    </details>
  );
}
