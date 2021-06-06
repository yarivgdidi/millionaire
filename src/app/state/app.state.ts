import {Question} from '../model/question';


export interface AppState {
  questions: ReadonlyArray<Question>;
}
