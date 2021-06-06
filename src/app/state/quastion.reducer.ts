import { createReducer, on, } from '@ngrx/store';
import {retrievedQuestionList} from './question.action';
import {Question} from '../model/question';

export const initialState: ReadonlyArray<Question> = [];

export const questionsReducer = createReducer(
  initialState,
  on(retrievedQuestionList, (state, action: any ) => {
    const {Questions} = action.payload;
    const newState = [ ...state, ...Questions ];
    console.log('initialState', initialState, 'newState', newState);
    return newState;
  })
);
