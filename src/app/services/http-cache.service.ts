import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {

  private cache = new Map<String, BehaviorSubject<Object>>();

  constructor(private http: HttpClient) { }

  get(url: string): Observable<Object> {
    const cached = this.cache.get(url);
    if(cached) {
      return cached;
    }

    const result = new BehaviorSubject<Object>(null);
    this.cache.set(url, result);
    this.http.get(url).subscribe(json => result.next(json));
    return result;
  }
}
