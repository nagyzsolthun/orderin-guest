import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import Category from 'src/app/domain/Category';
import { DataService } from 'src/app/services/data.service';

class MockRoute {
  params = new BehaviorSubject<any>({tableId: "tableId"});
}
class MockRouter {
  navigate(commands: Array<string>) { }
}
class MockDataService {
  rootCategories$ = new ReplaySubject<Category[]>(1);
  rootCategories(): Observable<Category[]> {
    return this.rootCategories$;
  }
}

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockRoute },
        { provide: DataService, useClass: MockDataService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the logo', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('img').src).toContain('assets/logo.svg');  // TODO this doesn't check the validity of the url
  });

  it('should redirect when data is available', () => {
    const router = TestBed.get(Router);
    const dataService = TestBed.get(DataService);

    const navigation = spyOn(router, 'navigate');

    const category = Category.fromJson({name: {en:"category"}});
    dataService.rootCategories$.next([category]);
    fixture.detectChanges();
    
    const commands = navigation.calls.first().args[0];
    expect(commands).toEqual(['tableId','products', "category"]);
  });
});
