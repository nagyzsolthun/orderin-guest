import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { CartButtonComponent } from './components/cart-button/cart-button.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NavbarCategoryComponent } from './components/navbar-category/navbar-category.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductComponent } from './components/product/product.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { DataService } from './services/data.service';


// TODO uuid matching https://gist.github.com/anein/fba647b4206695d109c30e1fc0d2e8ee

const routes: Routes = [
  { path: ':tableId/products/:categoryEnglishName', component: ProductListComponent },
  { path: ':tableId', component: WelcomeComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    NavbarCategoryComponent,
    ProductListComponent,
    WelcomeComponent,
    ProductComponent,
    LoadingComponent,
    ProductItemComponent,
    CartButtonComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [ DataService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
