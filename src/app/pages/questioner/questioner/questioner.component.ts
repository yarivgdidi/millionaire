import { Component, OnInit } from '@angular/core';
import {Question} from '../../../model/question';
import {QuestionsService} from '../../../services/questions.service';

@Component({
  selector: 'app-questioner',
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.scss']
})
export class QuestionerComponent implements OnInit {
  questions: Question[] = [];
  currentPage = 0;
  constructor(private questionsService: QuestionsService) { }

  ngOnInit(): void {
    for (let i = 0; i < 20; i++ ) {
      this.questions.push(
        {
          category: '',
          type: '',
          difficulty: '',
          question: '',
          correct_answer: '',
          incorrect_answers: ['', '', ''],
        }
      );
    }
    this.getQuestionAsync(0);
  }
  getQuestion(index: number): Question{
    return this.questions[index];
  }
  getQuestionAsync(index: number): void {
    const fromBin = this.questionsService.fromBinary;
    this.questionsService.getQuestions()
      .subscribe(response => {
        const result = (response as any).results[0];
        this.questions[index] = {
          category: fromBin(result.category),
          type: fromBin(result.type),
          difficulty: fromBin(result.difficulty),
          question: fromBin(result.question),
          correct_answer: fromBin(result.correct_answer),
          incorrect_answers: result.incorrect_answers.map((answer: string) => fromBin(answer)) ,
        };
      });
  }

  carouselOnPage(event: any): void {
    const { page } = event;
    this.currentPage = event.page;
    if (this.questions[page].question === '') {
      this.getQuestionAsync(event.page);
    }
  }
}
