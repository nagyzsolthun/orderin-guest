import { TestBed, inject } from '@angular/core/testing';

import { HttpCacheService } from './http-cache.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('HttpCacheService', () => {
  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpSpy.get.and.returnValue(of("HttpGetResponse"));

    TestBed.configureTestingModule({
      providers: [
        HttpCacheService,
        { provide: HttpClient, useValue: httpSpy },
      ]
    });
  });

  it('should be created', inject([HttpCacheService], (service: HttpCacheService) => {
    expect(service).toBeTruthy();
  }));

  it('provides the same object for repeated get calls on the same url, without sending multiple http requests', inject([HttpCacheService,HttpClient], (
    service: HttpCacheService,
    http: HttpClient) => {
    
    const httpSpy = TestBed.get(HttpClient);
    service.get("url").subscribe(json => expect(json).toBe("HttpGetResponse"));
    expect(httpSpy.get.calls.count()).toBe(1);
    
    service.get("url").subscribe(json => expect(json).toBe("HttpGetResponse"));
    expect(httpSpy.get.calls.count()).toBe(1);  // still 1
  }));

});
