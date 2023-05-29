import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(AppRoutingModule.routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  private static readonly routes: Routes = [];
  constructor() {
    console.log('AppRoutingModule constructor');
  }
}
