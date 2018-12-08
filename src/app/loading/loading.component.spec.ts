import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import Category from '../domain/Category';

class MockRoute {
  params = new BehaviorSubject<any>({tableId: "tableId"});
}
class MockRouter {
  navigate(commands: Array<string>) { }
}
class MockDataService {
  subject = new BehaviorSubject<Array<Category>>(null);
  rootCategories() {
    return this.subject;
  }
}

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockRoute },
        { provide: DataService, useClass: MockDataService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the logo', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('img').src).toContain('assets/logo.svg');  // TODO this doesn't check the validity of the url
  });

  it('should redirect when data is available', inject([Router, ActivatedRoute, DataService],(
      router: Router,
      route: ActivatedRoute,
      dataService: MockDataService) => {
        const navigation = spyOn(router, 'navigate');
        dataService.subject.next( new Array<Category>() );
        
        const commands = navigation.calls.first().args[0];
        expect(commands).toEqual(['tableId','products']);
    }));
});
