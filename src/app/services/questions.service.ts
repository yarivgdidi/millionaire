import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class QuestionsService {

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get('https://opentdb.com/api.php?amount=1&encode=base64&type=multiple');
  }


}
