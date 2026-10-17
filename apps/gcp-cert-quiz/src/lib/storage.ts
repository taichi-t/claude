import type { AnswerRecord, QuizSettings } from '../types';

const RECORDS_KEY = 'gcp-cert-quiz:records:v1';
const SETTINGS_KEY = 'gcp-cert-quiz:settings:v1';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // プライベートブラウジング等で保存できない場合は無視する
  }
}

export function loadRecords(): AnswerRecord[] {
  return read<AnswerRecord[]>(RECORDS_KEY, []);
}

export function saveRecords(records: AnswerRecord[]): void {
  write(RECORDS_KEY, records);
}

export function clearRecords(): void {
  try {
    localStorage.removeItem(RECORDS_KEY);
  } catch {
    // ignore
  }
}

export function loadSettings(): Partial<QuizSettings> {
  return read<Partial<QuizSettings>>(SETTINGS_KEY, {});
}

export function saveSettings(settings: QuizSettings): void {
  write(SETTINGS_KEY, settings);
}
