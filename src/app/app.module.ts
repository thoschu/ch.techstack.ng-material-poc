import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RootStoreConfig, StoreModule} from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AdminModule } from './admin/admin.module';
import { UserComponent } from './user/user.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { reducers, metaReducers, State } from './reducers';
import { MamaComponent } from './mama/mama.component';
import * as fromMama from './mama/reducers';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MamaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    AppRoutingModule,
    AdminModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature(fromMama.mamaFeatureKey, fromMama.reducers, { metaReducers: fromMama.metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
