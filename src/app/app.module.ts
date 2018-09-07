import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarQueryComponent } from './navbar-query/navbar-query.component';
import { NavbarCategoryComponent } from './navbar-category/navbar-category.component';
import { SearchService } from './services/search.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    NavbarQueryComponent,
    NavbarCategoryComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ SearchService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
