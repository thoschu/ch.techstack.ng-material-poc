import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';
import * as fromAdmin from './reducers';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(
      fromAdmin.adminFeatureKey,
      fromAdmin.reducers,
      { metaReducers: fromAdmin.metaReducers }
    )
  ]
})
export class AdminModule {
  public static forRoot(): ModuleWithProviders<AdminModule> {
    return {
      ngModule: AdminModule,
      providers: [AdminService]
    };
  }
}
