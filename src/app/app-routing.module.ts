import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BakedSaleComponent } from './pages/baked-sale/baked-sale.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'baked-sale',
    component: BakedSaleComponent
  },
  {
    redirectTo: '',
    path: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
