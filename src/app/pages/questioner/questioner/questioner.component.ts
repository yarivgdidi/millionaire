import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {QuestionsService} from '../../../services/questions.service';
import { environment } from '../../../../environments/environment';
import {selectQuestions} from '../../../state/question.selector';
import {select, Store} from '@ngrx/store';
import {QuestionDto} from '../../../model/QuestionDto';
import {QuestionObj} from '../../../model/QuestionObj';
import {AnswerObj} from '../../../model/AnswerObj';
import { shuffle } from 'lodash';

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
    }
  }
  startOver(): void {
    this.resetGame();
    this.fetchNextQuestion(0);
    const carouselControlElement = $('.p-carousel-indicator .p-link')[0];
    carouselControlElement.click();
  }

  getQuestion(index: number): QuestionObj{
    return this.questions[index];
  }

  getAnswer(answerObj: AnswerObj): void {
    const { answer , timer, index } = answerObj;
    this.questions[this.currentPage].answered = answer;
    this.questions[this.currentPage].timer = timer;
    if (answer?.isCorrect === false) {
      this.questionAnsweredCorrectly[index] = false;
      const element = $('.p-carousel-indicator .p-link');
      element.eq(index).addClass('strike');
    } else if (answer?.isCorrect === true ) {
      this.questionAnsweredCorrectly[index] = true;
      const element = $('.p-carousel-indicator .p-link');
      element.eq(index).addClass('success');
    } else if (this.questions[index].answered  === undefined && this.questions[this.currentPage].timer === 0) {
      // special case for timedout and skipped
      const element = $('.p-carousel-indicator .p-link');
      element.eq(index).addClass('strike');
      this.questionAnsweredCorrectly[this.currentPage] = false;
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
      this.dialogMessage = `Very good, only ${this.strikes} out of ${NUMBER_OF_QUESTIONS}`;
      this.dialogTitle = 'Wow';
    }
   }

  carouselOnPage(event: any): void {
    const { page } = event;
    this.currentPage = event.page;
    this.fetchNextQuestion(page);
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
