import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

class MockRoute {
  firstChild = {
    params: new BehaviorSubject<any>({tableId: "tableId"})
  }
}
class MockRouter {
  events = new BehaviorSubject<NavigationEnd>(null);
}
class MockHttpCLient {
  dataObservable = new BehaviorSubject<any>(null);
  get(url, options) {
    return this.dataObservable;
  }
}


describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataService,
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockRoute },
        { provide: HttpClient, useClass: MockHttpCLient },
      ]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  // TODO "should send request when all data available"
});
