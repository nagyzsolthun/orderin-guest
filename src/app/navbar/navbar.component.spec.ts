import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';
import { DataService } from '../services/data.service';
import { BehaviorSubject } from 'rxjs';
import Category from '../domain/Category';

class MockDataService {
  rootCategoriesObservable = new BehaviorSubject<Array<Category>>(null);
  rootCategories() {
    return this.rootCategoriesObservable;
  }
}

@Component({
  selector: 'app-navbar-category',
  template: '{{category}}'
})
class MockCategoryComponent {
  @Input() category;
}


describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent, MockCategoryComponent],
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

  it('should react on dataService rootCategories', inject([DataService], (dataService: MockDataService) => {
    const compiled = fixture.debugElement.nativeElement;

    const category1 = Category.fromJson({id: "id1", name:"category1"});
    const category2 = Category.fromJson({id: "id2", name:"category2"});

    // update with 1 category
    dataService.rootCategories().next([category1]);
    fixture.detectChanges();
    const renderedCategories1 = Array
      .from(compiled.querySelectorAll("app-navbar-category"))
      .map(node => (node as any).textContent);

    expect(component.rootCategories).toEqual(["category1"]);
    expect(renderedCategories1).toEqual(["category1"]);

    // update with 2 categories
    dataService.rootCategories().next([category1, category2]);
    fixture.detectChanges();
    const renderedCategories2 = Array
      .from(compiled.querySelectorAll("app-navbar-category"))
      .map(node => (node as any).textContent);

    expect(component.rootCategories).toEqual(["category1", "category2"]);
    expect(renderedCategories2).toEqual(["category1", "category2"]);
  }));
});
