import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCategoryComponent } from './navbar-category.component';

describe('NavbarCategoryComponent', () => {
  let component: NavbarCategoryComponent;
  let fixture: ComponentFixture<NavbarCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
