import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { StoreModule } from '@ngrx/store';
import * as fromMain from './reducers';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MainModule.routes),
    StoreModule.forFeature(fromMain.mainFeatureKey, fromMain.reducers, { metaReducers: fromMain.metaReducers })
  ]
})
export class MainModule {
  private static readonly routes: Routes = [
    {
      path: '',
      component: MainComponent
    }
  ];
}
