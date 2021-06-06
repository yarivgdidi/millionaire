import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class QuestionsService {

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get('https://opentdb.com/api.php?amount=1&encode=base64&type=multiple');
  }

  fromBinary(encoded: string): string {
      // returning just atob(encoded) is not UTF-8 safe;
      return  decodeURIComponent(atob(encoded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    }
}
