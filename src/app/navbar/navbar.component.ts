import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  rootCategories: Array<string> = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.rootCategories()
      .pipe(filter(categories => categories != null))
      .pipe(map(categories => categories.map(category => category.name)))
      .subscribe(categories => this.rootCategories = categories);
  }

}
