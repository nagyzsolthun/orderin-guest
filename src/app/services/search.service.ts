import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private subject: BehaviorSubject<string> = new BehaviorSubject("");

  constructor() { }

  query() {
    return this.subject.asObservable();
  }

  update(query: string) {
    this.subject.next(query);
  }

}
