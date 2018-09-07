import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-category',
  templateUrl: './navbar-category.component.html',
  styleUrls: ['./navbar-category.component.css', '../styles/navbar-button.css']
})
export class NavbarCategoryComponent implements OnInit {

  @Input() category: string;

  constructor() { }

  ngOnInit() {
  }

}
