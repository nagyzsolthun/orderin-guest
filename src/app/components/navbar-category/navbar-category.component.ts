import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import Category from 'src/app/domain/Category';
import { I18nService } from 'src/app/services/i18n.service';
import { RouteParamsService } from 'src/app/services/route-params.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-category',
  templateUrl: './navbar-category.component.html',
  styleUrls: ['./navbar-category.component.css']
})
export class NavbarCategoryComponent implements OnInit {

  @Input() category: Category;

  data$: Observable<{localName: string, tableId: string, englishName: string}>;

  constructor(
    private routeParamsService: RouteParamsService,
    private i18nService: I18nService) { }

  ngOnInit() {
    const localName$ = this.i18nService.localText(this.category.name);
    const tableId$ = this.routeParamsService.tableId();
    const englishName = I18nService.toEnglish(this.category.name);

    this.data$ = combineLatest(localName$, tableId$).pipe(map( ([localName,tableId]) => {
      return { localName, tableId, englishName };
    }))
  }

}
