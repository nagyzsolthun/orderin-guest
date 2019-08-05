import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { I18nService } from 'src/app/services/i18n.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit,OnDestroy {

  private subscription: Subscription;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const tableId$ = this.route.params.pipe(map(params => params.tableId));

    const firstCategoryEnglishName$ = this.dataService.rootCategories().pipe(
      map(categories => categories[0].name),
      map(I18nService.toEnglish));
    
    const firstCategoryProducts$ = firstCategoryEnglishName$.pipe(
      switchMap(firstCategoryName => this.dataService.productsOf(firstCategoryName))
    );
    
    this.subscription = combineLatest(tableId$, firstCategoryEnglishName$, firstCategoryProducts$)
      .subscribe( ([tableId,firstCategoryName, products]) => { // wait for products so no loading animation in category
        this.router.navigate([tableId, "products", firstCategoryName]);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
