import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import Category from 'src/app/domain/Category';
import { I18nService } from 'src/app/services/i18n.service';
import { RouteParamsService } from 'src/app/services/route-params.service';

@Component({
  selector: 'app-navbar-category',
  templateUrl: './navbar-category.component.html',
  styleUrls: ['./navbar-category.component.css']
})
export class NavbarCategoryComponent implements OnInit, OnDestroy {

  @Input() category: Category;
  @HostBinding('class.selected') selected;

  localName$: Observable<string>;

  private selectedSubscription: Subscription;
  private tableId$: Observable<string>;

  private englishName: string;

  constructor(
    private routeParamsService: RouteParamsService,
    private router: Router,
    private i18nService: I18nService) { }

  ngOnInit() {
    this.localName$ = this.i18nService.toLocal(this.category.name);
    this.englishName = I18nService.toEnglish(this.category.name);
    this.tableId$ = this.routeParamsService.tableId();
    this.selectedSubscription = this.routeParamsService.categoryEnglishName()
      .pipe(map(name => name == this.englishName))
      .subscribe(selected => this.selected = selected);
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe();
  }

  @HostListener('click')
  select() {
    this.tableId$
      .pipe(first())
      .subscribe(tableId => this.router.navigate([tableId, "products", this.englishName]));
  }

}
