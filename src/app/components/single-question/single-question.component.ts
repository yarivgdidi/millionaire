import {Component, Input,  OnDestroy, Output, EventEmitter, OnInit} from '@angular/core';
import {Option} from '../../model/Option';

import { environment } from '../../../environments/environment';
import { QuestionObj } from '../../model/QuestionObj';
import { AnswerObj } from '../../model/AnswerObj';

const TIMER = environment.QUESTION_TIMEOUT;

@Component({
  selector: 'app-single-question',
  templateUrl: './single-question.component.html',
  styleUrls: ['./single-question.component.scss']
})
export class SingleQuestionComponent implements OnInit, OnDestroy {
  @Input() questionObj!: QuestionObj;
  @Output() answer = new EventEmitter<AnswerObj>();
  options: Option[] = [];
  scrambled: Option[] = [];
  timer = TIMER;
  setIntervalHandler = 0;

  constructor() { }

  ngOnInit(): void {
    this.timer = TIMER;
    clearInterval(this.setIntervalHandler);
    if (this.questionObj.question.incorrect_answers.length > 0 ) {
      this.setIntervalHandler = setInterval(() => this.clickTimer(), 1000);
    }

  }

  ngOnDestroy(): void {
    clearInterval(this.setIntervalHandler);
  }

  answerClicked(answer: Option): any{
    clearInterval(this.setIntervalHandler);
    this.answer.emit( {answer, timer: this.timer} );
  }

  clickTimer(): void  {
    this.timer -= 1;
    if (this.timer === 0 ) {
      clearInterval(this.setIntervalHandler);
      this.answer.emit( {answer: undefined, timer: this.timer} );
    }
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
    return this.questionObj.answered !== undefined || this.timer === 0;
  }
  getTimeRemainingAsFraction(): number {
    return this.timer * 100 / TIMER;
  }

  trackByOption( index: number, item: Option): string {
    return item.answer;
  }
}
