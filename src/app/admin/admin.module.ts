import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { StoreModule } from '@ngrx/store';
import * as fromAdmin from './reducers';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromAdmin.adminFeatureKey, fromAdmin.reducers, { metaReducers: fromAdmin.metaReducers })
  ]
})
export class AdminModule {
  public static forRoot(): ModuleWithProviders<AdminModule> {
    return {
      ngModule: AdminModule,
      providers: []
    };
  }
}
