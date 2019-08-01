import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
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
    const rootCategories$ = this.dataService.rootCategories();
    this.subscription = combineLatest(tableId$, rootCategories$).subscribe( ([tableId,rootCategories]) => {
      const firstCategory = rootCategories[0];
      const firstCategoryName = I18nService.toEnglish(firstCategory.name);
      this.router.navigate([tableId, "products", firstCategoryName]);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
