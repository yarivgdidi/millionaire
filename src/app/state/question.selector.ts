import { createSelector, createFeatureSelector } from '@ngrx/store';
import {AppState} from './app.state';
import {Question} from '../model/question';

export const selectOneQuestion = createSelector(
  (state: AppState) => state.questions,
  (questions: Array<Question>) => questions
);


