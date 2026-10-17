import type { Exam, Section, Subsection } from '../types';

export const exams: Exam[] = [
  {
    id: 'pcse',
    code: 'PCSE',
    name: 'Professional Cloud Security Engineer',
    guideUrl: 'https://cloud.google.com/learn/certification/cloud-security-engineer?hl=ja',
    description:
      'アクセス制御・境界防御・データ保護・運用・コンプライアンスの5セクション。50〜60問／120分。',
  },
  {
    id: 'pca',
    code: 'PCA',
    name: 'Professional Cloud Architect',
    guideUrl: 'https://cloud.google.com/learn/certification/guides/professional-cloud-architect?hl=ja',
    description:
      '設計・プロビジョニング・セキュリティ・プロセス改善・実装管理・運用の6セクション。ケーススタディが2件出題され、全体の20〜30%を占める。50〜60問／120分。',
  },
];

/**
 * セクション名・比率は公式試験ガイドに準拠。
 * PCSE: https://services.google.com/fh/files/misc/professional_cloud_security_engineer_exam_guide_japanese.pdf
 * PCA : https://cloud.google.com/learn/certification/guides/professional-cloud-architect?hl=ja
 */
export const sections: Section[] = [
  {
    id: 'pcse-1',
    exam: 'pcse',
    number: 1,
    title: 'アクセスの構成',
    titleEn: 'Configuring access',
    weight: '約25%',
  },
  {
    id: 'pcse-2',
    exam: 'pcse',
    number: 2,
    title: '通信を保護して境界保護を確立する',
    titleEn: 'Securing communications and establishing boundary protection',
    weight: '約22%',
    focus: true,
  },
  {
    id: 'pcse-3',
    exam: 'pcse',
    number: 3,
    title: 'データ保護の確保',
    titleEn: 'Ensuring data protection',
    weight: '約23%',
    focus: true,
  },
  {
    id: 'pcse-4',
    exam: 'pcse',
    number: 4,
    title: '運用管理',
    titleEn: 'Managing operations',
    weight: '約19%',
  },
  {
    id: 'pcse-5',
    exam: 'pcse',
    number: 5,
    title: 'コンプライアンス要件への対応',
    titleEn: 'Supporting compliance requirements',
    weight: '約11%',
  },
  {
    id: 'pca-1',
    exam: 'pca',
    number: 1,
    title: 'クラウド ソリューション アーキテクチャの設計と計画',
    titleEn: 'Designing and planning a cloud solution architecture',
    weight: '24%以下',
    focus: true,
  },
  {
    id: 'pca-2',
    exam: 'pca',
    number: 2,
    title: 'ソリューション インフラストラクチャの管理とプロビジョニング',
    titleEn: 'Managing and provisioning a solution infrastructure',
    weight: '15%以下',
    focus: true,
  },
  {
    id: 'pca-3',
    exam: 'pca',
    number: 3,
    title: 'セキュリティとコンプライアンスを考慮した設計',
    titleEn: 'Designing for security and compliance',
    weight: '18%以下',
    focus: true,
  },
  {
    id: 'pca-4',
    exam: 'pca',
    number: 4,
    title: '技術プロセスやビジネス プロセスの分析と改善',
    titleEn: 'Analyzing and optimizing technical and business processes',
    weight: '18%以下',
  },
  {
    id: 'pca-5',
    exam: 'pca',
    number: 5,
    title: '実装の管理',
    titleEn: 'Managing implementation',
    weight: '11%以下',
  },
  {
    id: 'pca-6',
    exam: 'pca',
    number: 6,
    title: 'ソリューションとオペレーションの信頼性の確保',
    titleEn: 'Ensuring solution and operations excellence',
    weight: '14%以下',
  },
];

const sub = (sectionId: string, number: string, title: string): Subsection => ({
  id: `${sectionId}:${number}`,
  sectionId,
  number,
  title,
});

export const subsections: Subsection[] = [
  sub('pcse-1', '1.1', 'Cloud Identity の管理'),
  sub('pcse-1', '1.2', 'サービス アカウントの管理'),
  sub('pcse-1', '1.3', '認証の管理'),
  sub('pcse-1', '1.4', '認可制御の管理と実装'),
  sub('pcse-1', '1.5', 'リソース階層の定義'),
  sub('pcse-2', '2.1', '境界セキュリティの設計と構成'),
  sub('pcse-2', '2.2', '境界セグメンテーションの構成'),
  sub('pcse-2', '2.3', 'プライベート接続の確立'),
  sub('pcse-3', '3.1', '機密データの保護とデータ損失の防止'),
  sub('pcse-3', '3.2', '保存時・転送時・使用時の暗号化の管理'),
  sub('pcse-3', '3.3', 'AI ワークロードの計画と保護'),
  sub('pcse-4', '4.1', 'インフラストラクチャとアプリケーションのセキュリティの自動化'),
  sub('pcse-4', '4.2', 'ロギング、モニタリング、検出の構成'),
  sub('pcse-5', '5.1', 'クラウドの規制要件の判断'),
  sub('pca-1', '1.1', 'ビジネス要件を満たすソリューション インフラストラクチャを設計する'),
  sub('pca-1', '1.2', '技術要件を満たすソリューション インフラストラクチャを設計する'),
  sub('pca-1', '1.3', 'ネットワーク、ストレージ、コンピューティング リソースを設計する'),
  sub('pca-1', '1.4', '移行計画を作成する'),
  sub('pca-1', '1.5', '将来のソリューションの向上を想定する'),
  sub('pca-2', '2.1', 'ネットワーク トポロジを構成する'),
  sub('pca-2', '2.2', 'ストレージ システムを個別に構成する'),
  sub('pca-2', '2.3', 'コンピューティング システムを構成する'),
  sub('pca-3', '3.1', 'セキュリティを考慮して設計する'),
  sub('pca-3', '3.2', 'コンプライアンスを考慮して設計する'),
  sub('pca-4', '4.1', '技術プロセスを分析、定義する'),
  sub('pca-4', '4.2', 'ビジネス プロセスを分析、定義する'),
  sub('pca-4', '4.3', '本番環境でソリューションの信頼性を確保する手順を開発する'),
  sub('pca-5', '5.1', 'ソリューションを確実に導入できるように開発チームや運用チームに助言する'),
  sub('pca-5', '5.2', 'Google Cloud をプログラムで操作する'),
  sub('pca-6', '6.1', 'モニタリング、ロギング、プロファイリング、通知ソリューション'),
  sub('pca-6', '6.2', 'デプロイとリリース管理'),
  sub('pca-6', '6.3', 'デプロイされたソリューションのサポート支援'),
  sub('pca-6', '6.4', '品質管理方法の評価'),
];

export function sectionsOf(exam: Exam['id']): Section[] {
  return sections.filter((s) => s.exam === exam);
}

export function findSection(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

export function findSubsection(exam: Exam['id'], number: string): Subsection | undefined {
  const major = number.split('.')[0];
  return subsections.find((s) => s.sectionId === `${exam}-${major}` && s.number === number);
}
