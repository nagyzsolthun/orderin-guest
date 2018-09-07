import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-query',
  templateUrl: './navbar-query.component.html',
  styleUrls: ['./navbar-query.component.css', '../styles/navbar-button.css']
})
export class NavbarQueryComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  query = "";
  count = 1;  // TODO

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.subscription = this.searchService.query().subscribe(query => this.query = query);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
