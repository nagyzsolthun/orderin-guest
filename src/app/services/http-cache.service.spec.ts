import { TestBed, inject } from '@angular/core/testing';

import { HttpCacheService } from './http-cache.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

class MockHttpClient {
  get = (url: string) =>  of("HttpGetResponse");
}

describe('HttpCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpCacheService,
        { provide: HttpClient, useClass: MockHttpClient },
      ]
    });
  });

  it('provides the same object for repeated get calls on the same url, without sending multiple http requests', () => {
    const service = TestBed.get(HttpCacheService);
    const httpClient = TestBed.get(HttpClient);
    const getSpy = spyOn(httpClient, "get").and.callThrough();

    service.get("url").pipe(first()).subscribe(json => expect(json).toBe("HttpGetResponse"));
    expect(getSpy.calls.count()).toBe(1);
    
    service.get("url").pipe(first()).subscribe(json => expect(json).toBe("HttpGetResponse"));
    expect(getSpy.calls.count()).toBe(1);  // still 1
  });

});
