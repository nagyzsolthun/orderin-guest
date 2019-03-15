import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import Category from '../domain/Category';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  rootCategories$: Observable<Category[]>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.rootCategories$ = this.dataService.rootCategories();
  }

}
