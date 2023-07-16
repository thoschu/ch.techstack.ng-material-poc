import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';
import * as fromAdmin from './reducers';
import { AdminEffects } from './admin.effects';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(fromAdmin.adminFeatureKey, fromAdmin.reducers, {
      metaReducers: fromAdmin.metaReducers,
    }),
    EffectsModule.forFeature([AdminEffects]),
  ],
})
export class AdminModule {
  public static forRoot(): ModuleWithProviders<AdminModule> {
    return {
      ngModule: AdminModule,
      providers: [AdminService],
    };
  }
}
