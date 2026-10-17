import type { Question } from '../types';
import { pcaQuestions } from './pca';
import { pcseQuestions } from './pcse';

export const questions: Question[] = [...pcseQuestions, ...pcaQuestions];
