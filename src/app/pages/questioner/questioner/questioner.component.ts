import {Component, OnInit } from '@angular/core';
import {QuestionsService} from '../../../services/questions.service';
import {selectQuestions} from '../../../state/question.selector';
import {select, Store} from '@ngrx/store';
import {QuestionDto} from '../../../model/QuestionDto';
import {QuestionObj} from '../../../model/QuestionObj';
import {AnswerObj} from '../../../model/AnswerObj';
import { shuffle } from 'lodash';

import { environment } from '../../../../environments/environment';
import {Option} from '../../../model/Option';
const TIMER = environment.QUESTION_TIMEOUT;

const NUMBER_OF_QUESTIONS = environment.NUMBER_OF_QUESTIONS;
declare var $: any;
@Component({
  selector: 'app-questioner',
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.scss']
})
export class QuestionerComponent implements OnInit {
  // @ts-ignore
  questions: QuestionObj[] = [];
  questionStack: QuestionDto[] = [];
  currentPage = 0;
  questionAnsweredCorrectly: any[] = [];
  timers: number[] = [];
  timersHandlers: number[] = [];
  success = 0;
  strikes = 0;
  displayDialog = false;
  dialogMessage = '';
  dialogTitle = '';
  cheat = false;
  constructor(private questionsService: QuestionsService,
              private store: Store
  ) {}

  ngOnInit(): void {
    this.resetGame();
    this.store.dispatch({type: '[Questioner Page] Load Questions'});
    // get one more for next cycle
    // I would have change the query to bring 2 only in this case, but it was not allowed
    this.store.dispatch({type: '[Questioner Page] Load Questions'});
    // @ts-ignore
    this.store.pipe(select(selectQuestions)).subscribe(questions => {
      if (this.currentPage === 0 && this.questions[0].question.question === '' && questions.length > 0) {
        this.questions[0] = this.prepareQuestionObj(questions[0]) ;
        this.handleTimers(0);
      }
      this.questionStack = [...questions];
    });
  }

  private resetGame(): void {
    this.currentPage = 0;
    this.questionAnsweredCorrectly = [];
    this.success = 0;
    this.strikes = 0;
    this.questions = [];
    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++) {
      this.questions.push(
        {
          index: i,
          question: {
            category: '',
            type: '',
            difficulty: '',
            question: '',
            correct_answer: '',
            incorrect_answers: ['', '', ''],
          },
          options: []
        }
      );
      clearInterval(this.timersHandlers[i]);
      this.timers[i] = TIMER;
    }
    this.timersHandlers = [];
  }
  startOver(): void {
    this.resetGame();
    this.fetchNextQuestion(0);
    const carouselControlElement = $('.p-carousel-indicator .p-link')[0];
    carouselControlElement.click();
    $('.p-carousel-indicator .p-link').removeClass('strike');
    $('.p-carousel-indicator .p-link').removeClass('success');
  }

  getQuestion(index: number): QuestionObj{
    return this.questions[index];
  }

  getAnswer(answerObj: AnswerObj): void {
    const { answer, index } = answerObj;
    clearInterval(this.timersHandlers[index]);
    this.questions[index].answered = answer;
    if (answer?.isCorrect === false) {
      this.questionAnsweredCorrectly[index] = false;
      const element = $('.p-carousel-indicator .p-link');
      element.eq(index).addClass('strike');
    } else if (answer?.isCorrect === true ) {
      this.questionAnsweredCorrectly[index] = true;
      const element = $('.p-carousel-indicator .p-link');
      element.eq(index).addClass('success');
    }
    this.strikes = this.questionAnsweredCorrectly.filter(status => status === false).length;
    this.success = this.questionAnsweredCorrectly.filter(status => status === true).length;

    if (this.strikes > 2) {
      this.displayDialog = true;
      this.dialogMessage = 'Sorry, 3 strikes, you\'re out';
      this.dialogTitle = 'Oops';
    } else if (this.success === NUMBER_OF_QUESTIONS) {
      this.displayDialog = true;
      this.dialogMessage = `Perfect`;
      this.dialogTitle = 'Wow';
    } else if (this.success + this.strikes === NUMBER_OF_QUESTIONS) {
      this.displayDialog = true;
      this.dialogMessage = `Very good, only ${this.strikes} error(s) out of ${NUMBER_OF_QUESTIONS}`;
      this.dialogTitle = 'Wow';
    }
   }

  carouselOnPage(event: any): void {
    const { page } = event;
    this.currentPage = event.page;
    this.handleTimers(page);
    this.fetchNextQuestion(page);
  }

  private handleTimers(page: number): void {
    if (this.timersHandlers[page] === undefined && this.strikes < 3) {
      this.timersHandlers[page] = setInterval(() => ((thisWrapper, pageWrapper) => {
        thisWrapper.timers[pageWrapper] -= 1;
        if (thisWrapper.timers[pageWrapper] === 0) {
          const answer: Option = {
            isCorrect: false,
            origIndex: 0,
            answer: ''
          };
          const answerObj: AnswerObj = {
            answer, index: pageWrapper
          };
          thisWrapper.getAnswer(answerObj);
        }
      })(this, page), 1000);
    }
  }

  private fetchNextQuestion(page: number): void{
    this.store.dispatch({type: '[Questioner Page] Load Questions'});
    if (this.questions[page].question.question === '') {
      const question = this.questionStack.pop();
      this.questions[page] = this.prepareQuestionObj(question as QuestionDto);
    }
  }

  private prepareQuestionObj(question: QuestionDto): QuestionObj {
    const { incorrect_answers } = question;
    const options = incorrect_answers.map((answer, index) => ({answer, isCorrect: false, origIndex: index}));
    options.push({answer: question.correct_answer, isCorrect: true, origIndex: 3});
    const scrambled = shuffle(options);
    const preparedQuestion = {
      index: this.currentPage,
      question,
      options: scrambled
    };
    return preparedQuestion as QuestionObj;
  }
}
