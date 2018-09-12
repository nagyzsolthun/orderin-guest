import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { RouteService } from './route.service';

class MockHttpCLient {
  dataObservable = new BehaviorSubject<any>(null);
  get(url, options) {
    return this.dataObservable;
  }
}

class MockRouteService {
  tableIdObservable = new BehaviorSubject<string>(null);
  tableId() {
    return this.tableIdObservable;
  }
}


describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataService,
        { provide: HttpClient, useClass: MockHttpCLient },
        { provide: RouteService, useClass: MockRouteService },
      ]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  // TODO "should send request when all data available"
});
