import { createSelector } from '@ngrx/store';
import {AppState} from './app.state';
import {QuestionDto} from '../model/QuestionDto';

export const selectQuestions = createSelector(
  (state: AppState) => state.questions,
  (questions: Array<QuestionDto>) => questions
);


