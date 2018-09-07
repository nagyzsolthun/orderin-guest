import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarQueryComponent } from './navbar-query.component';
import { SearchService } from '../services/search.service';

describe('NavbarQueryComponent', () => {
  let component: NavbarQueryComponent;
  let fixture: ComponentFixture<NavbarQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarQueryComponent ],
      providers: [ SearchService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update if SearchService updates', () => {
    const searchService: SearchService = TestBed.get(SearchService);
    searchService.update("testQuery");
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain("testQuery");
  });
});
