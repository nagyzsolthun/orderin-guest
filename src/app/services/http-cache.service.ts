import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { publishLast, refCount, publishReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {

  private cache = new Map<String, Observable<any>>();

  constructor(private http: HttpClient) { }

  get(url: string): Observable<any> {
    const cached = this.cache.get(url);
    if(cached) {
      return cached;
    }

    const result = this.http.get(url).pipe(publishReplay(1), refCount());
    this.cache.set(url, result)
    return result;
  }
}
