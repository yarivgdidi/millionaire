import { Component, OnInit } from '@angular/core';
import {Question} from '../../../model/question';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-questioner',
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.scss']
})
export class QuestionerComponent implements OnInit {
  questions: Question[] = [];
  currentPage = 0;
  constructor(private http: HttpClient ) { }

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
    this.http.get('https://opentdb.com/api.php?amount=1&encode=base64&type=multiple')
      .subscribe(response => {
        const result = (response as any).results[0];
        this.questions[index] = {
          category: this.fromBinary(result.category),
          type: this.fromBinary(result.type),
          difficulty: this.fromBinary(result.difficulty),
          question: this.fromBinary(result.question),
          correct_answer: this.fromBinary(result.correct_answer),
          incorrect_answers: result.incorrect_answers.map((answer: string) => this.fromBinary(answer)) ,
        };
      });
  }

  fromBinary(encoded: string): string {
    // returning just atob(encoded) is not UTF-8 safe;
    return  decodeURIComponent(atob(encoded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  }

  carouselOnPage(event: any): void {
    const { page } = event;
    this.currentPage = event.page;
    if (this.questions[page].question === '') {
      this.getQuestionAsync(event.page);
    }
  }


}
