import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  rootCategories: Array<string> = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.rootCategories().subscribe(rootCategories => this.rootCategories = rootCategories);
  }

}
