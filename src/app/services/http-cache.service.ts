import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

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

    const result = this.http.get(url).pipe(shareReplay(1));
    this.cache.set(url, result)
    return result;
  }
}
