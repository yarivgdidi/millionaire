import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Question} from '../../model/question';
import {Option} from '../../model/option';
import { shuffle } from 'lodash';
import { environment } from '../../../environments/environment';

const TIMER = environment.QUESTION_TIMEOUT;

@Component({
  selector: 'app-single-question',
  templateUrl: './single-question.component.html',
  styleUrls: ['./single-question.component.scss']
})
export class SingleQuestionComponent implements OnChanges , OnDestroy {
  @Input() question!: Question;
  options: Option[] = [];
  scrambled: Option[] = [];
  timer = TIMER;
  setIntervalHandler = 0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.timer = TIMER;
    clearInterval(this.setIntervalHandler);
    if (this.question && this.question.incorrect_answers.length > 0 ) {
      this.options = this.question.incorrect_answers.map((answer, index) => ({answer, isCorrect: false, origIndex: index}));
      this.options.push({ answer: this.question.correct_answer, isCorrect: true, origIndex: 3 });
      this.scrambled = shuffle(this.options);
      this.setIntervalHandler = setInterval(() => this.clickTimer(), 1000);
    }
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
