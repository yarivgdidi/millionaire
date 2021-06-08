import {QuestionDto} from './QuestionDto';
import {Option} from './Option';

export interface QuestionObj {
  index: number;
  question: QuestionDto;
  options: Option[];
  answered?: Option;
  timer?: number;
  skipped?: boolean;
}
