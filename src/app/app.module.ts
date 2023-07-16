import {
  APP_INITIALIZER, ErrorHandler,
  Injectable, InjectionToken, Inject,
  isDevMode, NgModule
} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Store, StoreModule } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { delay, tap } from 'rxjs';
import * as Rollbar from 'rollbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppEffects } from './app.effects';
import { appActions } from './app.actions';
import { AdminModule } from './admin/admin.module';
import { UserComponent } from './user/user.component';
import { metaReducers, reducers, Users } from './reducers';
import { MamaEffects } from './mama/mama.effects';
import { MamaComponent } from './mama/mama.component';
import * as fromMama from './mama/reducers';
import { UserGuard } from './user/user.guard';

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  public static readonly ROLLBAR_CONFIG: { accessToken: string, captureUncaught: boolean, captureUnhandledRejections: boolean } = {
    accessToken: '9a0fa97ccf6c448fb56d6d854f8538d4',
    captureUncaught: true,
    captureUnhandledRejections: true,
  };
  constructor(@Inject(RollbarService) private rollbar: Rollbar) { }

  public handleError(err: any) : void {
    this.rollbar.error(err.originalError || err);
  }

  public static ROLLBAR_FACTORY() : Rollbar {
    return new Rollbar(RollbarErrorHandler.ROLLBAR_CONFIG);
  }
}

export function rollbarFactory() {
  return new Rollbar(RollbarErrorHandler.ROLLBAR_CONFIG);
}

export const RollbarService: InjectionToken<Rollbar> = new InjectionToken<Rollbar>('rollbar');

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
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: true, // e.g Date-Object
        strictStateSerializability: true
      }
    }),
    StoreModule.forFeature(fromMama.mamaFeatureKey, fromMama.reducers, {metaReducers: fromMama.metaReducers}),
    EffectsModule.forRoot([AppEffects]),
    EffectsModule.forFeature([MamaEffects]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: !isDevMode()}),
    StoreRouterConnectingModule.forRoot({stateKey: 'router', routerState: RouterState.Minimal}),
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: AppModule.appInitializerUsingPromises,
      deps: [HttpClient, Store],
      multi: true
    },
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: RollbarService, useFactory: RollbarErrorHandler.ROLLBAR_FACTORY },
    UserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  private static readonly URL: URL = new URL("/api/users/",'http://localhost:3100/');

  constructor() { }

  private static appInitializerUsingPromises(httpClient: HttpClient, store: Store): () => Promise<void> {
    console.log(AppModule.URL);
    return () => new Promise((resolve, reject): void => {
        httpClient.get<Users>(AppModule.URL.href)
          .pipe(tap((result: Users): void => {
            console.log(result);

            const loadAppsAction: TypedAction<'[App] Load Apps'> = appActions.loadApps();

            store.dispatch(loadAppsAction);
          }))
          .pipe(delay<Users>(3000))
          .subscribe(
            (res: Users): void => {
              console.log('HTTP response', res);

              const loadAppsConfigAction: {app: string | Record<'id' | 'name', string | number>[]} & TypedAction<'[App] Load Apps Config'> =
                appActions.loadAppsConfig({app: res});

              store.dispatch(loadAppsConfigAction);

              resolve();
            },
            (err: Error): void => {
              console.error('HTTP Error', err);

              reject();
            },
            () => console.log('HTTP request completed.')
          );
      });
  }
}
