import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {

  private cache = new Map<String, Observable<any>>();

  constructor(private http: HttpClient) { }

  get(baseUrl: string, params?: any): Observable<any> {
    const url = HttpCacheService.generateUrl(baseUrl, params);
    const cached = this.cache.get(url);
    if(cached) {
      return cached;
    }

    const result = this.http.get(url).pipe(shareReplay(1));
    this.cache.set(url, result)
    return result;
  }

  private static generateUrl(url: string, params:any) {
    if(!params) {
      return url;
    }
    
    return url + "?" + Object.keys(params)
      .map(param => `${param}=${encodeURIComponent(params[param])}`)
      .join("&");
  }
}
