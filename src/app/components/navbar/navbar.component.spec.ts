import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import Category from 'src/app/domain/Category';
import { DataService } from 'src/app/services/data.service';
import { NavbarComponent } from './navbar.component';


class MockDataService {
  rootCategoriesObservable = new BehaviorSubject<Array<Category>>(null);
  rootCategories() {
    return this.rootCategoriesObservable;
  }
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should react on dataService rootCategories', () => {

    const dataService = TestBed.get(DataService);

    const category1 = Category.fromJson({id: "id1", name:{"en": "category1"}});
    const category2 = Category.fromJson({id: "id2", name:{"en": "category2"}});

    // update with 1 category
    dataService.rootCategories().next([category1]);
    fixture.detectChanges();
    component.rootCategories$.pipe(first())
      .subscribe(categories => expect(categories).toEqual([category1]));

    // update with 2 categories
    dataService.rootCategories().next([category1, category2]);
    fixture.detectChanges();
    component.rootCategories$.pipe(first())
      .subscribe(categories => expect(categories).toEqual([category1,category2]));
  });
});
