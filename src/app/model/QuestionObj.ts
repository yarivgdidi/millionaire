import {QuestionDto} from './questionDto';
import {Option} from './option';

export interface QuestionObj {
  question: QuestionDto;
  options: Option[];
  answered?: Option;
  timer?: number;
}
