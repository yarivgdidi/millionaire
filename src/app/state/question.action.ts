import { createAction, props } from '@ngrx/store';
import {QuestionDto} from '../model/QuestionDto';

export const retrievedQuestionList = createAction(
  '[Questions API] Questions Loaded Success',
  props<{Questions: QuestionDto[]}>()
);
