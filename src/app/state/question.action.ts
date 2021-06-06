import { createAction, props } from '@ngrx/store';
import {Question} from '../model/question';

export const retrievedQuestionList = createAction(
  '[Question List/API] Retrieve Questions',
  props<{Questions: Question[]}>()
);
