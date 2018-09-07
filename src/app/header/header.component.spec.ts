import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { SearchService } from '../services/search.service';
import { Subscriber } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [ SearchService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.logo').src).toContain('assets/logo.svg');  // TODO this doesn't really test it
  }));

  it('should call searchService on userInput', async(() => {
    const searchService: SearchService = TestBed.get(SearchService);
    spyOn(searchService, 'update');

    const compiled = fixture.debugElement.nativeElement;
    const input = compiled.querySelector('input');

    input.value = "testQuery";
    input.dispatchEvent(new Event("input"));

    expect(searchService.update).toHaveBeenCalledWith("testQuery");
    
  }));

});
