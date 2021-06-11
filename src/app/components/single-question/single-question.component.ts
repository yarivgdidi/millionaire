import {Component, Input, OnDestroy, Output, EventEmitter, OnInit, SimpleChanges} from '@angular/core';
import {Option} from '../../model/Option';
import { QuestionObj } from '../../model/QuestionObj';
import { AnswerObj } from '../../model/AnswerObj';

import { environment } from '../../../environments/environment';
const TIMER = environment.QUESTION_TIMEOUT;

@Component({
  selector: 'app-single-question',
  templateUrl: './single-question.component.html',
  styleUrls: ['./single-question.component.scss']
})
export class SingleQuestionComponent {
  @Input() questionObj!: QuestionObj;
  @Input() strikes!: number;
  @Input() set timer(value: number) {
    this.timerWrapper = value;
    // if (value === 0) {
    //   const answer: Option = {
    //     isCorrect: false,
    //     origIndex: 0,
    //     answer: ''
    //   };
    //   this.answerClicked(answer);
    // }
  }
  @Output() answer = new EventEmitter<AnswerObj>();
  timerWrapper = 100;
  options: Option[] = [];
  scrambled: Option[] = [];
  setIntervalHandler = 0;
  mouseDown = [false, false, false, false];

  // ngOnChange(changes: SimpleChanges)

  answerClicked(answer: Option): any{
    this.answer.emit( {answer, index: this.questionObj.index } );
  }
  getOptionClass(option: Option, answered?: Option ): string {
    let statusClass = '';
    if (answered) {
      statusClass += 'answered';
      statusClass += option.isCorrect ? ' correct' : ' incorrect';
      if (answered.answer === option.answer ) {
        statusClass += ' selected';
      }
    } else if (this.timer === 0 ) {
      statusClass += 'time-out';
      statusClass += option.isCorrect ? ' correct' : ' incorrect';
    }
    return statusClass;
  }
  isDisabled(): boolean {
    return this.questionObj.answered !== undefined || this.timer === 0 || this.strikes > 2;
  }
  getTimeRemainingAsFraction(): number {
    return this.timerWrapper * 100 / TIMER;
  }
  trackByOption( index: number, item: Option): string {
    return item.answer;
  }
}
