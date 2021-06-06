import { createAction, props } from '@ngrx/store';
import {Question} from '../model/question';

export const retrievedQuestionList = createAction(
  '[Questions API] Questions Loaded Success',
  props<{Questions: Question[]}>()
);
