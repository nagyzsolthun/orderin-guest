import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, map, first } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { I18nService } from '../services/i18n.service';

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
    this.subscription = combineLatest(tableId$, rootCategories$).subscribe( values => {
      const tableId = values[0];
      const rootCategories = values[1];

      const firstCategory = rootCategories[0];
      const firstCategoryName = I18nService.toEnglish(firstCategory.name);
      this.router.navigate([tableId, "products", firstCategoryName]);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
