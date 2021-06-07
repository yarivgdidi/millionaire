import { createReducer, on, } from '@ngrx/store';
import {retrievedQuestionList} from './question.action';
import {Question} from '../model/question';
import { uniqBy } from 'lodash'
export const initialState: ReadonlyArray<Question> = [];

const fromBinary = (encoded: string): string => {
  // returning just atob(encoded) is not UTF-8 safe;
  return  decodeURIComponent(atob(encoded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
};

export const questionsReducer = createReducer(
  initialState,
  on(retrievedQuestionList, (state, action: any ) => {
    const {Questions} = action.payload;
    const convertedQuestions = Questions.map( (question: Question) => ({
        category: fromBinary(question.category),
        type: fromBinary(question.type),
        difficulty: fromBinary(question.difficulty),
        question: fromBinary(question.question),
        correct_answer: fromBinary(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map((answer: string) => fromBinary(answer))
      }
   ));
    const newState = uniqBy([ ...state, ...convertedQuestions ], q => q.question);
    return newState;
  })
);
