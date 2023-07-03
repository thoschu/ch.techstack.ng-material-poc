import { NgModule, isDevMode, APP_INITIALIZER } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RootStoreConfig, StoreModule} from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { delay, map, Observable, Subscription, tap } from 'rxjs';

import { AdminModule } from './admin/admin.module';
import { UserComponent } from './user/user.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { reducers, metaReducers, State } from './reducers';
import { MamaComponent } from './mama/mama.component';
import * as fromMama from './mama/reducers';
import { UserGuard } from './user/user.guard';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { MamaEffects } from './mama/mama.effects';
import { Admin, IAdmin } from './admin/admin.model';

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
    HttpClientModule,
    AppRoutingModule,
    AdminModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature(fromMama.mamaFeatureKey, fromMama.reducers, { metaReducers: fromMama.metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([AppEffects]),
    EffectsModule.forFeature([MamaEffects]),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: AppModule.appInitializerUsingPromises,
      deps: [HttpClient],
      multi: true
    },
    UserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  private static appInitializerUsingPromises(httpClient: HttpClient): () => Promise<void> {
    return () => new Promise((resolve, reject): void => {
        httpClient.get('http://localhost:3100/api/users/')
          .pipe(delay<Object>(2000))
          .subscribe(
            res => {
              console.log('HTTP response', res);
              resolve();
            },
            err => {
              console.error('HTTP Error', err);
              reject();
            },
            () => console.log('HTTP request completed.')
          );
      });
  }
}
