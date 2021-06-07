import {Component, Input, OnChanges, OnDestroy, Output, SimpleChanges, EventEmitter } from '@angular/core';
import {Option} from '../../model/Option';

import { environment } from '../../../environments/environment';
import {QuestionObj} from '../../model/QuestionObj';
import {AnswerObj} from '../../model/AnswerObj';

const TIMER = environment.QUESTION_TIMEOUT;

@Component({
  selector: 'app-single-question',
  templateUrl: './single-question.component.html',
  styleUrls: ['./single-question.component.scss']
})
export class SingleQuestionComponent implements OnChanges , OnDestroy {
  @Input() questionObj!: QuestionObj;
  @Output() answer = new EventEmitter<AnswerObj>();
  options: Option[] = [];
  scrambled: Option[] = [];
  timer = TIMER;
  setIntervalHandler = 0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.timer = TIMER;
    clearInterval(this.setIntervalHandler);
    if (this.questionObj.question.incorrect_answers.length > 0 ) {
      this.setIntervalHandler = setInterval(() => this.clickTimer(), 1000);
    }
  }

  answerClicked(answer: Option): any{
    this.answer.emit( {answer, timer: this.timer} );
  }

  ngOnDestroy(): void{
    clearInterval(this.setIntervalHandler);
  }

  clickTimer(): void  {
    this.timer -= 1;
    if (this.timer === 0 ) {
      clearInterval(this.setIntervalHandler);
    }
  }

  getTimeRemainingAsFraction(): number {
    return this.timer * 100 / TIMER;
  }

  trackByOption( index: number, item: Option): string {
    return item.answer;
  }
}
