import { Component, OnInit, Input, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { RouteService } from '../services/route.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-category',
  templateUrl: './navbar-category.component.html',
  styleUrls: ['./navbar-category.component.css']
})
export class NavbarCategoryComponent implements OnInit, OnDestroy {

  @Input() category: string;
  @HostBinding('class.selected') selected;

  private selectedSubscription: Subscription;
  private tableId$: Observable<string>;

  constructor(private routeService: RouteService, private router: Router) { }

  ngOnInit() {
    this.tableId$ = this.routeService.tableId();
    this.selectedSubscription = this.routeService.category()
      .pipe(map(category => category == this.category))
      .subscribe(selected => this.selected = selected);
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe();
  }

  @HostListener('click')
  select() {
    this.tableId$
      .pipe(first())
      .subscribe(tableId => this.router.navigate([tableId, "products", this.category]));
  }

}
